using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestobarSayka.Data;
using RestobarSayka.Models;
using RestobarSayka.Models.StoredProcedure;

namespace RestobarSayka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoPedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductoPedidosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductoPedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoPedido>>> GetProductoPedidos()
        {
            var productosPedidos = await _context.ProductoPedidos.ToListAsync();
            return Ok(productosPedidos);
        }

        // GET: api/ProductoPedidos/DePedido/id
        [HttpGet("DePedido/{id}")]
        public async Task<ActionResult<IEnumerable<ProductoPedido>>> GetProductoPedidosDePedido(int id)
        {
            var productosPedidos = await _context.ProductoPedidos.Where(e => e.PedidoIdPedido == id).OrderByDescending(r => r.Hora).ToListAsync();
            return Ok(productosPedidos);
        }

        // GET: api/ProductoPedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoPedido>> GetProductoPedido(int id)
        {
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);

            if (productoPedido == null)
            {
                return NotFound("ProductoPedido No Encontrado");
            }

            return Ok(productoPedido);
        }


        // GET api/ProductoPedidos/Bar
        [HttpGet("Bar")]
        public async Task<ActionResult<IEnumerable<SP_ProductoPedido>>> GetSPBar()
        {
            try
            {
                var result = await _context.SP_Productopedido.FromSqlInterpolated($"Exec SP_ProductoPedidoBar").ToListAsync();
                return Ok(result);
            }
             catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        // GET api/ProductoPedidos/Cocina
        [HttpGet("Cocina")]
        public async Task<ActionResult<IEnumerable<SP_ProductoPedido>>> GetSPCocina()
        {
            var result = await _context.SP_Productopedido.FromSqlInterpolated($"Exec SP_ProductoPedidoCocina").ToListAsync();
            return Ok(result);
        }


        // PUT: api/ProductoPedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductoPedido(int id, ProductoPedido productoPedido)
        {
            if (id != productoPedido.IdProductoPedido)
            {
                return BadRequest("ProductoPedido No actualizado");
            }

            _context.Entry(productoPedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoPedidoExists(id))
                {
                    return NotFound("ProductoPedido No Encontrado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido);
        }


        // PUT: api/ProductoPedidos/recepcion/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("recepcion/{id}")]
        public async Task<IActionResult> PutRecepcionProductoPedido(int id)
        {

            var productoPedido = await _context.ProductoPedidos.FindAsync(id);

            if ( productoPedido == null)
            {
                return BadRequest("ProductoPedido No encontrado para update");
            }


            productoPedido.Recepcion = true;
            _context.Entry(productoPedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoPedidoExists(id))
                {
                    return NotFound("ProductoPedido No Encontrado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido.IdProductoPedido);
        }




        // POST: api/ProductoPedidos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductoPedido>> PostProductoPedido(ProductoPedido productoPedido)
        {
            try
            {
                productoPedido.Fecha = DateTime.Today;
                productoPedido.Hora = DateTime.Now.TimeOfDay;
                productoPedido.Recepcion = false;
                _context.ProductoPedidos.Add(productoPedido);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProductoPedidoExists(productoPedido.IdProductoPedido))
                {
                    return Conflict("Conflicto, Producto Pedido No Guardado");
                }
                else
                {
                    throw;
                }
            }

            return Ok(productoPedido);
        }
        //[HttpDelete("{id}/{usuario}")]
        // DELETE: api/ProductoPedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductoPedido(int id)
        {
            ImpresorasController impresoras = new ImpresorasController(_context);
            var productoPedido = await _context.ProductoPedidos.FindAsync(id);
            if (productoPedido == null)
            {
                return NotFound("ProductoPedido No Encontrado");
            }

            try
            {
                if (productoPedido.Recepcion == true)
                {
                    var productoCancelado = (from m in _context.Mesas
                                             join pd in _context.Pedidos on m.IdMesa equals pd.MesaIdMesa
                                             join pp in _context.ProductoPedidos on pd.IdPedido equals pp.PedidoIdPedido
                                             join pr in _context.Productos on pp.ProductoIdProducto equals pr.IdProducto
                                             join c in _context.Categoria on pr.CategoriaIdCategoria equals c.IdCategoria
                                             join u in _context.Usuarios on pd.UsuarioIdUsuario equals u.IdUsuario
                                             where pp.IdProductoPedido == id
                                             select new TicketCancelado
                                             {
                                                 IdPedido = pd.IdPedido,
                                                 Producto = pr.Nombre,
                                                 NombreReferencia = pp.NombreReferencia,
                                                 Comentario = pp.Comentario,
                                                 Cantidad = pp.Cantidad,
                                                 Mesa = m.Nombre,
                                                 Usuario = u.Nombre,
                                                 IdProductoPedido = pp.IdProductoPedido,
                                                 IpImpresora = c.IpImpresora
                                             }).FirstOrDefault();

                    impresoras.ImprimirTicketCancelaAsync(productoCancelado);
                }

                _context.ProductoPedidos.Remove(productoPedido);
                await _context.SaveChangesAsync();
               
            }
            catch
            {
                return BadRequest("El ProductoPedido No fue Eliminado");
            }


            return Ok(id);
        }

        private bool ProductoPedidoExists(int id)
        {
            return _context.ProductoPedidos.Any(e => e.IdProductoPedido == id);
        }
    }
}
