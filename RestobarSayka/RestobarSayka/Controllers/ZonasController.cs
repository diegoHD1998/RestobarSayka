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
    public class ZonasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ZonasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Zonas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zona>>> GetZonas()
        {
            var zonas = await _context.Zonas.ToListAsync();
            return Ok(zonas);
        }

        // GET: api/Zonas/zonasActivas
        [HttpGet("zonasActivas")]
        public async Task<ActionResult<IEnumerable<Zona>>> GetZonasActivas()
        {
            var zonas = await _context.Zonas.Where(z => z.Estado == "Activo").ToListAsync();

            if (zonas == null)
            {
                return NotFound("Zonas Activas No Encontradas");
            }

            return Ok(zonas);
        }

        // GET: api/Zonas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Zona>> GetZona(int id)
        {
            var zona = await _context.Zonas.FindAsync(id);

            if (zona == null)
            {
                return NotFound("Zona No Encontrada");
            }

            return Ok(zona);
        }

        // PUT: api/Zonas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutZona(int id, Zona zona)
        {
            if (id != zona.IdZona)
            {
                return BadRequest("Los Ids de Zona No Coinciden");
            }

            _context.Entry(zona).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ZonaExists(id))
                {
                    return NotFound("No se a Encontrado la Zona a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetZona", new { id = zona.IdZona }, zona);
        }

        // POST: api/Zonas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Zona>> PostZona(Zona zona)
        {
            try
            {
                _context.Zonas.Add(zona);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Zona No fue Guardada");
            }


            return CreatedAtAction("GetZona", new { id = zona.IdZona }, zona);
        }

        // DELETE: api/Zonas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZona(int id)
        {
            var zona = await _context.Zonas.FindAsync(id);
            if (zona == null)
            {
                return NotFound("Zona No Encontrada");
            }

            try
            {
                _context.Zonas.Remove(zona);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Zona No fue Eliminada");
            }


            return Ok(id);
        }

        private bool ZonaExists(int id)
        {
            return _context.Zonas.Any(e => e.IdZona == id);
        }
    }
}
