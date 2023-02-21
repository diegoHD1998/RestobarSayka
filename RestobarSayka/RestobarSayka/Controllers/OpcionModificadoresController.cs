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
    public class OpcionModificadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OpcionModificadoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OpcionModificadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpcionModificador>>> GetOpcionModificadors()
        {
            var opcionModificadores = await _context.OpcionModificadors.ToListAsync();
            return Ok(opcionModificadores);
        }

        // GET: api/OpcionModificadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OpcionModificador>> GetOpcionModificador(int id)
        {
            var opcionModificador = await _context.OpcionModificadors.FindAsync(id);

            if (opcionModificador == null)
            {
                return NotFound("Opcion Modificador No Encontrado");
            }

            return Ok(opcionModificador);
        }

        // PUT: api/OpcionModificadores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOpcionModificador(int id, OpcionModificador opcionModificador)
        {
            if (id != opcionModificador.IdOpcionM)
            {
                return BadRequest("Los Ids de OpcionModificador No Coinciden");
            }

            _context.Entry(opcionModificador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpcionModificadorExists(id))
                {
                    return NotFound("No se a Encontrado La Opcion Modificador ");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOpcionModificador", new { id = opcionModificador.IdOpcionM }, opcionModificador);
        }

        // POST: api/OpcionModificadores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OpcionModificador>> PostOpcionModificador(OpcionModificador opcionModificador)
        {
            

            try
            {
                _context.OpcionModificadors.Add(opcionModificador);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Opcion Modificador No fue Guardada");
            }

            return CreatedAtAction("GetOpcionModificador", new { id = opcionModificador.IdOpcionM }, opcionModificador);
        }

        // DELETE: api/OpcionModificadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOpcionModificador(int id)
        {
            var opcionModificador = await _context.OpcionModificadors.FindAsync(id);
            if (opcionModificador == null)
            {
                return NotFound("Opcion Modificador No Encontrada");
            }

            

            try
            {
                _context.OpcionModificadors.Remove(opcionModificador);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Opcion Modificador No fue Eliminada");
            }

            return Ok(id);
        }

        private bool OpcionModificadorExists(int id)
        {
            return _context.OpcionModificadors.Any(e => e.IdOpcionM == id);
        }
    }
}
