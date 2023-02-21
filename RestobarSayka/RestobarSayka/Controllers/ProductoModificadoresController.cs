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
    public class ProductoModificadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoModificadoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductoModificadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoModificador>>> GetProductoModificadors()
        {
            var modificadores = await _context.ProductoModificadors.ToListAsync();
            return Ok(modificadores);
        }

        // GET: api/ProductoModificadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoModificador>> GetProductoModificador(int id)
        {
            var productoModificador = await _context.ProductoModificadors.FindAsync(id);

            if (productoModificador == null)
            {
                return NotFound("ProductoModificadores No Encontrados");
            }

            return Ok(productoModificador);
        }

        // PUT: api/ProductoModificadores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoModificador(int id, ProductoModificador productoModificador)
        {
            if (id != productoModificador.ProductoIdProducto)
            {
                return BadRequest("Los Ids de ProductoModificador No Coinciden");
            }

            _context.Entry(productoModificador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoModificadorExists(id))
                {
                    return NotFound("No se a Encontrado el ProductoModificador a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductoModificador", new { id = productoModificador.ProductoIdProducto }, productoModificador);
        }

        // POST: api/ProductoModificadores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoModificador>> PostProductoModificador(ProductoModificador productoModificador)
        {
            _context.ProductoModificadors.Add(productoModificador);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductoModificadorExists(productoModificador.ProductoIdProducto))
                {
                    return Conflict("Conflicto Encontrado");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProductoModificador", new { id = productoModificador.ProductoIdProducto }, productoModificador);
        }

        // DELETE: api/ProductoModificadores/5
        [HttpDelete("{idP}/{idM}")]
        public async Task<IActionResult> DeleteProductoModificador(int idP,int idM)
        {
            var productoModificador = await _context.ProductoModificadors.Where(o => o.ProductoIdProducto == idP && o.ModificadorIdModificador == idM).FirstAsync();
            if (productoModificador == null)
            {
                return NotFound("ProductoModificador No Encontrado");
            }

            

            try
            {
                _context.ProductoModificadors.Remove(productoModificador);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("El ProductoModificador No fue Eliminado");
            }

            return Ok(productoModificador);
        }

        [HttpGet("pm-existentes/{id}")]
        public async Task<ActionResult<IEnumerable<ProductoModificador>>> ProductoWithModificador(int id)
        {
            var modificadores = await _context.ProductoModificadors.Where(o => o.ProductoIdProducto == id).ToListAsync();
            return Ok(modificadores);
        }




        private bool ProductoModificadorExists(int id)
        {
            return _context.ProductoModificadors.Any(e => e.ProductoIdProducto == id);
        }
    }
}
