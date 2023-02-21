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
    public class VariantesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VariantesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Variantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Variante>>> GetVariantes()
        {
            var variantes = await _context.Variantes.ToListAsync();
            return Ok(variantes);
        }

        // GET: api/Variantes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Variante>> GetVariante(int id)
        {
            var variante = await _context.Variantes.FindAsync(id);

            if (variante == null)
            {
                return NotFound("Variente No Encontrada");
            }

            return Ok(variante);
        }

        // PUT: api/Variantes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVariante(int id, Variante variante)
        {
            if (id != variante.IdVariante)
            {
                return BadRequest("Los Ids de Variante No Coinciden");
            }

            _context.Entry(variante).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VarianteExists(id))
                {
                    return NotFound("No se a Encontrado La variente a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetVariante", new { id = variante.IdVariante }, variante);
        }

        // POST: api/Variantes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Variante>> PostVariante(Variante variante)
        {
            try
            {
                _context.Variantes.Add(variante);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Variante No fue Guardada");
            }

            return CreatedAtAction("GetVariante", new { id = variante.IdVariante }, variante);
        }

        // DELETE: api/Variantes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVariante(int id)
        {
            var variante = await _context.Variantes.FindAsync(id);
            if (variante == null)
            {
                return NotFound("Variente No Encontrada");
            }

            try
            {
                _context.Variantes.Remove(variante);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Variente No fue Eliminada");
            }



            return Ok(id);
        }

        private bool VarianteExists(int id)
        {
            return _context.Variantes.Any(e => e.IdVariante == id);
        }
    }
}
