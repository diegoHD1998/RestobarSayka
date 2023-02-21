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
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategoria()
        {
            var categorias = await _context.Categoria.ToListAsync();
            return Ok(categorias);
        }

        // GET api/Categorias/categoriasActivas
        [HttpGet("categoriasActivas")]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategoriasActivas()
        {
            var categorias = await _context.Categoria.Where(c => c.Estado == "Activo").ToListAsync();

            if (categorias == null)
            {
                return NotFound("Categorias Activas No Encontradas");
            }

            return Ok(categorias);
        }


        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);

            if (categoria == null)
            {
                return NotFound("Categoria No Encontrada");
            }

            return Ok(categoria);
        }

        // PUT: api/Categorias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.IdCategoria)
            {
                return BadRequest("Los Ids de Categoria No Coinciden");
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound("No se a Encontrado la Categoria a Modificar");
                }
                else
                {
                    throw;
                }
            }
            return CreatedAtAction("GetCategoria", new { id = categoria.IdCategoria }, categoria);
        }

        // POST: api/Categorias
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            try
            {
                _context.Categoria.Add(categoria);
                await _context.SaveChangesAsync();
            }
            catch
            {
                BadRequest("La Categoria No fue Guardada");
            }

            return CreatedAtAction("GetCategoria", new { id = categoria.IdCategoria }, categoria);
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null)
            {
                return NotFound("Categoria No Encontrada");
            }

            try
            {
                _context.Categoria.Remove(categoria);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Categoria No fue Eliminada");
            }

            return Ok(id);
        }

        private bool CategoriaExists(int id)
        {
            return _context.Categoria.Any(e => e.IdCategoria == id);
        }
    }
}
