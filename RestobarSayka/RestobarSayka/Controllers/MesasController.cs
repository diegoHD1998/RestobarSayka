using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestobarSayka.Data;
using RestobarSayka.Dtos;
using RestobarSayka.Models;

namespace RestobarSayka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MesasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MesasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Mesas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mesa>>> GetMesas()
        {
            var mesas = await _context.Mesas.ToListAsync();
            return Ok(mesas);
        }

        // GET: api/Mesas/disponibles
        [HttpGet("disponibles")]
        public async Task<ActionResult<IEnumerable<Mesa>>> GetMesasDisponibles()
        {
            var mesas = await _context.Mesas.Where(m => m.Disponibilidad == false).ToListAsync();
            return Ok(mesas);
        }


        // GET: api/Mesas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mesa>> GetMesa(int id)
        {
            var mesa = await _context.Mesas.FindAsync(id);

            if (mesa == null)
            {
                return NotFound("Mesa No Encontrada");
            }

            return Ok(mesa);
        }

        // PUT: api/Mesas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMesa(int id, Mesa mesa)
        {
            if (id != mesa.IdMesa)
            {
                return BadRequest("Los Ids de Mesa No Coinciden");
            }

            _context.Entry(mesa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MesaExists(id))
                {
                    return NotFound("No se a Encontrado la Mesa a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetMesa", new { id = mesa.IdMesa }, mesa);
        }

        // POST: api/Mesas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Mesa>> PostMesa(Mesa mesa)
        {
            try
            {
                mesa.Disponibilidad = false;
                _context.Mesas.Add(mesa);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Mesa No fue Guardada");
            }

            return Ok(mesa);
        }

        [HttpPost("TransferirMesa")]
        public async Task<ActionResult<Mesa>> TransferirMesa(TranferenciaDto value)
        {
            Mesa mesaDestino;
            try
            {
                
                var pedido = await _context.Pedidos.FindAsync(value.IdPedido);
                var mesaOriginal = await _context.Mesas.FindAsync(pedido.MesaIdMesa);
                mesaDestino = await _context.Mesas.FindAsync(value.IdMesa);

                mesaOriginal.Disponibilidad = false;
                _context.Entry(mesaOriginal).State = EntityState.Modified;

                pedido.MesaIdMesa = value.IdMesa;
                mesaDestino.Disponibilidad = true;
                _context.Entry(mesaDestino).State = EntityState.Modified;

                _context.Entry(pedido).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                
            }
            catch
            {
                return BadRequest("El pedido no fue modificado");
            }

            return Ok(new Mesa
            {
             IdMesa = mesaDestino.IdMesa,
             Nombre = mesaDestino.Nombre,
             ZonaIdZona = mesaDestino.ZonaIdZona,
             Disponibilidad = mesaDestino.Disponibilidad

            });


        }
        [HttpPost("DividirPedido")]
        public async Task<ActionResult> DividirPedido(List<ProductoPedido> ProductosPedidos, int IdMesa, int IdUsuario)
        {
            try
            {
                var pedido = await _context.Pedidos.Where(p=>p.MesaIdMesa ==IdMesa && p.Estado ==true).FirstOrDefaultAsync();
                if(pedido == null)
                {
                    var nuevoPedido = new Pedido();
                    nuevoPedido.Fecha = DateTime.Today;
                    nuevoPedido.Estado = true;
                    nuevoPedido.UsuarioIdUsuario = IdUsuario;
                    nuevoPedido.MesaIdMesa = IdMesa;
                    _context.Pedidos.Add(nuevoPedido);
                    await _context.SaveChangesAsync();
                    foreach (var item in ProductosPedidos)
                    {
                        item.PedidoIdPedido = nuevoPedido.IdPedido;
                        _context.Entry(item).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                    }
                }
                else
                {
                    foreach (var item in ProductosPedidos)
                    {
                        item.PedidoIdPedido = pedido.IdPedido;
                        _context.Entry(item).State = EntityState.Modified;
                        await _context.SaveChangesAsync();
                    }
                }
                
            }
            catch
            {
                return BadRequest("El pedido no fue modificado");
            }

            return Ok();
        }

        // DELETE: api/Mesas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMesa(int id)
        {
            var mesa = await _context.Mesas.FindAsync(id);

            if (mesa == null)
            {
                return NotFound("Mesa No Encontrada");
            }

            try
            {
                _context.Mesas.Remove(mesa);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La Mesa No fue Eliminada");
            }

            return Ok(id);
        }

        private bool MesaExists(int id)
        {
            return _context.Mesas.Any(e => e.IdMesa == id);
        }
    }
}
