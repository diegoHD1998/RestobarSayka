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
    public class OpcionVariantesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OpcionVariantesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OpcionVariantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpcionVariante>>> GetOpcionVariantes()
        {
            var opcionVariantes = await _context.OpcionVariantes.ToListAsync();
            return Ok(opcionVariantes);
        }

        // GET: api/OpcionVariantes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OpcionVariante>> GetOpcionVariante(int id)
        {
            var opcionVariante = await _context.OpcionVariantes.FindAsync(id);

            if (opcionVariante == null)
            {
                return NotFound("Opcion Vaiante No Encontrada");
            }

            return Ok(opcionVariante);
        }

        // PUT: api/OpcionVariantes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOpcionVariante(int id, OpcionVariante opcionVariante)
        {
            if (id != opcionVariante.IdOpcionV)
            {
                return BadRequest("Los Ids de Opcion Variante No Coinciden");
            }

            _context.Entry(opcionVariante).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpcionVarianteExists(id))
                {
                    return NotFound("No se a Encontrado La Opcion Variante a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOpcionVariante", new { id = opcionVariante.IdOpcionV }, opcionVariante);
        }

        // POST: api/OpcionVariantes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OpcionVariante>> PostOpcionVariante(OpcionVariante opcionVariante)
        {
            try
            {
                _context.OpcionVariantes.Add(opcionVariante);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Opcion Variante No fue Guardada");
            }

            return CreatedAtAction("GetOpcionVariante", new { id = opcionVariante.IdOpcionV }, opcionVariante);
        }

        // DELETE: api/OpcionVariantes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOpcionVariante(int id)
        {
            var opcionVariante = await _context.OpcionVariantes.FindAsync(id);
            if (opcionVariante == null)
            {
                return NotFound("Opcion Variante No Encontrada");
            }

            try
            {
                _context.OpcionVariantes.Remove(opcionVariante);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Opcion Variante No fue Eliminada");
            }

            return Ok(id);
        }

        // GET: api/OpcionVariantes/opcionesEspecificas/2
        [HttpGet("opcionesEspecificas/{id}")]
        public async Task<ActionResult<IEnumerable<OpcionVariante>>> OpcionesVariantes(int id)
        {
            var opcionesVariantes = await _context.OpcionVariantes.Where(o => o.VarianteIdVariante == id).ToListAsync();

            if (opcionesVariantes == null)
            {
                return NotFound("Opciones Variantes No Encontradas");
            }

            return Ok(opcionesVariantes);
        }

        private bool OpcionVarianteExists(int id)
        {
            return _context.OpcionVariantes.Any(e => e.IdOpcionV == id);
        }
    }
}
