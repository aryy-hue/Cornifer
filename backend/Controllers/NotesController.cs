using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers;
[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotesHub> _hubContext;

    public NotesController(AppDbContext context,
        IHubContext<NotesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
    {
        return await _context.Notes.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Note>> CreateNote(Note note)
    {
        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("NoteCreated");

        return CreatedAtAction(
            nameof(GetNote),
            new{id = note.Id},
            note
        );
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Note>> GetNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if(note == null)
        {
            return NotFound();
        }
        return note;
    }
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatedNote(int id, Note updatedNote)
    {
        var note = await _context.Notes.FindAsync(id);
        if(note == null)
        {
            return NotFound();
        }
        note.Title = updatedNote.Title;
        note.Content = updatedNote.Content;

        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if(note == null)
        {
            return NotFound();
        }
        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}