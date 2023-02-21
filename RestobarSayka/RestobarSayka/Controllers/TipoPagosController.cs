using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestobarSayka.Data;
using RestobarSayka.Models;

namespace RestobarSayka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoPagosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TipoPagosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TipoPagos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoPago>>> GetTipoPagos()
        {
            return await _context.TipoPagos.ToListAsync();
        }

        // GET: api/TipoPagos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoPago>> GetTipoPago(int id)
        {
            var tipoPago = await _context.TipoPagos.FindAsync(id);

            if (tipoPago == null)
            {
                return NotFound();
            }

            return tipoPago;
        }

        // PUT: api/TipoPagos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoPago(int id, TipoPago tipoPago)
        {
            if (id != tipoPago.IdTipoPago)
            {
                return BadRequest();
            }

            _context.Entry(tipoPago).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoPagoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TipoPagos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TipoPago>> PostTipoPago(TipoPago tipoPago)
        {
            _context.TipoPagos.Add(tipoPago);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipoPago", new { id = tipoPago.IdTipoPago }, tipoPago);
        }

        // DELETE: api/TipoPagos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoPago(int id)
        {
            var tipoPago = await _context.TipoPagos.FindAsync(id);
            if (tipoPago == null)
            {
                return NotFound();
            }

            _context.TipoPagos.Remove(tipoPago);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoPagoExists(int id)
        {
            return _context.TipoPagos.Any(e => e.IdTipoPago == id);
        }
    }
}
