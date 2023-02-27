using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ESCPOS_NET.Emitters;
using ESCPOS_NET.Utilities;
using ESCPOS_NET;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestobarSayka.Data;
using RestobarSayka.Models;

namespace RestobarSayka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImpresorasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ImpresorasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Impresoras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Impresora>>> GetImpresoras()
        {
            return await _context.Impresoras.ToListAsync();
        }

        // GET: api/Impresoras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Impresora>> GetImpresora(int id)
        {
            var impresora = await _context.Impresoras.FindAsync(id);

            if (impresora == null)
            {
                return NotFound();
            }

            return impresora;
        }

        // PUT: api/Impresoras/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImpresora(int id, Impresora impresora)
        {
            if (id != impresora.IdImpresora)
            {
                return BadRequest("Los Ids de Impresora No coinciden");
            }

            _context.Entry(impresora).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImpresoraExists(id))
                {
                    return NotFound("No se a encotrado la Impresora a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return Ok(impresora);
        }

        // POST: api/Impresoras
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{id}")]
        public async Task<ActionResult> PostImpresora(int id)
        {
            try
            {
                var ipCategorias = _context.Categoria.Select(i => i.IpImpresora).Distinct().ToList();
                foreach (var itemIp in ipCategorias)
                {
                    var productosPedido = (from m in _context.Mesas
                                           join pd in _context.Pedidos on m.IdMesa equals pd.MesaIdMesa
                                           join pp in _context.ProductoPedidos on pd.IdPedido equals pp.PedidoIdPedido
                                           join pr in _context.Productos on pp.ProductoIdProducto equals pr.IdProducto
                                           join c in _context.Categoria on pr.CategoriaIdCategoria equals c.IdCategoria
                                           join u in _context.Usuarios on pd.UsuarioIdUsuario equals u.IdUsuario
                                           where c.IpImpresora == itemIp
                                           && pp.Recepcion == false
                                           && pd.IdPedido == id
                                           select new TicketPedido
                                           {
                                               IdPedido = pd.IdPedido,
                                               Producto = pr.Nombre,
                                               NombreReferencia = pp.NombreReferencia,
                                               Comentario = pp.Comentario,
                                               Cantidad = pp.Cantidad,
                                               Mesa = m.Nombre,
                                               Usuario = u.Nombre,
                                               IdProductoPedido = pp.IdProductoPedido
                                           }).ToList();
                    if (productosPedido.Count > 0)
                    {
                        ImprimirTicketPedidoAsync(productosPedido, itemIp);
                        foreach (var item in productosPedido)
                        {
                            var productoPedido = await _context.ProductoPedidos.FindAsync(item.IdProductoPedido);

                            productoPedido.Recepcion = true;
                            _context.Entry(productoPedido).State = EntityState.Modified;
                            await _context.SaveChangesAsync();
                        }
                    }


                }

                var _ProductosPedidos = await _context.ProductoPedidos.ToListAsync();

                var ListaProductoPedidos = _ProductosPedidos.FindAll(value => value.PedidoIdPedido == id);

                return Ok(ListaProductoPedidos);
            }
            catch (Exception)
            {
                return BadRequest("Problema para imprimir revise las impresoras");
            }
        }
        private async void ImprimirTicketPedidoAsync(List<TicketPedido> productosPedido, string ipImpresora)
        {
            // Ethernet or WiFi (This uses an Immediate Printer, no live paper status events, but is easier to use)
            var hostnameOrIp = ipImpresora;
            var port = 9100;
            var printer = new ImmediateNetworkPrinter(new ImmediateNetworkPrinterSettings() { ConnectionString = $"{hostnameOrIp}:{port}" });
            var e = new EPSON();
            byte[] detalle = e.PrintLine("------------------------");
            var encabezado = ByteSplicer.Combine(
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("------------------------"),
                e.LeftAlign(),
                e.PrintLine("N Interno: " + productosPedido[0].IdPedido),
                e.PrintLine(DateTime.Now.ToString("yyyy-MM-dd") + " " + DateTime.Now.ToString("HH:mm:ss")),
                e.PrintLine("Mesa: " + productosPedido[0].Mesa),
                e.PrintLine(productosPedido[0].Usuario)
                );
            foreach (var detallePedido in productosPedido)
            {
                detalle = ByteSplicer.Combine(detalle,
                     e.LeftAlign(),
                     e.SetStyles(PrintStyle.Bold | PrintStyle.DoubleWidth),
                     e.PrintLine(detallePedido.Cantidad.ToString() + " X " +  detallePedido.Producto + " " + detallePedido.NombreReferencia ),
                     e.SetStyles(PrintStyle.None));
                if (!string.IsNullOrEmpty(detallePedido.Comentario))
                {
                    detalle = ByteSplicer.Combine(detalle,
                                         e.LeftAlign(),
                                         e.PrintLine("*** " + detallePedido.Comentario)
                                        );
                }
                detalle = ByteSplicer.Combine(detalle,
                     e.LeftAlign(),
                     e.SetStyles(PrintStyle.DoubleWidth),
                     e.PrintLine("------------------------")
                    );
            }
            await printer.WriteAsync( // or, if using and immediate printer, use await printer.WriteAsync
              ByteSplicer.Combine(
                encabezado,
                detalle,                
                e.PrintLine(""),
                e.PrintLine(""),
                e.PrintLine(""),
                e.PrintLine(""),
                e.PrintLine(""),
                e.PrintLine(""),
                e.FullCut()
              )
            );
        }
        public async void ImprimirTicketCancelaAsync(TicketCancelado productoCancelado)
        {
            // Ethernet or WiFi (This uses an Immediate Printer, no live paper status events, but is easier to use)
            var hostnameOrIp = productoCancelado.IpImpresora;
            var port = 9100;
            var printer = new ImmediateNetworkPrinter(new ImmediateNetworkPrinterSettings() { ConnectionString = $"{hostnameOrIp}:{port}" });
            var e = new EPSON();
            await printer.WriteAsync( // or, if using and immediate printer, use await printer.WriteAsync
             ByteSplicer.Combine(
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("------------------------"),
                e.LeftAlign(),
                e.PrintLine("N Interno: " + productoCancelado.IdPedido),
                e.PrintLine("TICKET DE CANCELACION"),
                e.PrintLine(DateTime.Now.ToString("yyyy-MM-dd") + " " + DateTime.Now.ToString("HH:mm:ss")),
                e.PrintLine("Mesa: " + productoCancelado.Mesa),
                e.PrintLine(productoCancelado.Usuario),
                e.PrintLine("------------------------"),
                e.SetStyles(PrintStyle.Bold | PrintStyle.DoubleWidth),
                e.PrintLine("CANCELADO:"),
                e.PrintLine(productoCancelado.Cantidad.ToString() + " X " + productoCancelado.Producto + " " + productoCancelado.NombreReferencia),
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("------------------------"),
                e.PrintLine(" "),
                e.PrintLine(" "),
                e.FullCut()
                )
            );
        }
        [HttpPost("PreCuenta")]
        public async void ImprimirPreCuenta(TicketCuenta ticketCuenta)
        {
            string ipImpresora = _context.Categoria.Where(c => c.Nombre == "PreCuenta").Select(e => e.IpImpresora).FirstOrDefault();
            // Ethernet or WiFi (This uses an Immediate Printer, no live paper status events, but is easier to use)
            var hostnameOrIp = ipImpresora;
            var port = 9100;
            var printer = new ImmediateNetworkPrinter(new ImmediateNetworkPrinterSettings() { ConnectionString = $"{hostnameOrIp}:{port}" });
            var e = new EPSON();
            byte[] detalle = e.PrintLine("------------------------");
            var encabezado = ByteSplicer.Combine(
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("------------------------"),
                e.CenterAlign(),
                e.SetStyles(PrintStyle.Bold | PrintStyle.DoubleWidth),
                e.PrintLine("CERVECERIA SAYKA"),
                e.SetStyles(PrintStyle.DoubleWidth),
                e.LeftAlign(),
                e.PrintLine("N Interno: " + ticketCuenta.IdPedido),
                e.PrintLine(DateTime.Now.ToString("yyyy-MM-dd") + " " + DateTime.Now.ToString("HH:mm:ss")),
                e.PrintLine("Mesa: " + ticketCuenta.Mesa)/*,
                e.PrintLine(productosPedido[0].Usuario)*/
                );
            foreach (var detallePedido in ticketCuenta.productosCuenta)
            {
                detalle = ByteSplicer.Combine(detalle,
                     e.RightAlign(),
                     e.SetStyles(PrintStyle.FontB),
                     e.PrintLine(detallePedido.Cantidad.ToString().PadRight(5) + (detallePedido.nombre + " " + detallePedido.NombreReferencia).PadLeft(50) + detallePedido.Total.ToString().PadLeft(10))
                    );
            }
            await printer.WriteAsync( // or, if using and immediate printer, use await printer.WriteAsync
              ByteSplicer.Combine(
                encabezado,
                detalle,
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("------------------------"),
                e.PrintLine(" "),
                e.SetStyles(PrintStyle.DoubleWidth),
                e.PrintLine("Total:".PadRight(20) + ticketCuenta.Subtotal.ToString().PadLeft(10)),
                e.PrintLine("Propina Sugerida:".PadRight(20) + ticketCuenta.Propina.ToString().PadLeft(10)),
                e.PrintLine("Total c/propina".PadRight(20) + ticketCuenta.Total.ToString().PadLeft(10)),
                e.PrintLine(" "),
                e.PrintLine("------------------------"),
                e.PrintLine("Gracias por su preferencia!!"),
                e.PrintLine(" "),
                e.FullCut()
              )
            );
        }
        // DELETE: api/Impresoras/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImpresora(int id)
        {
            var impresora = await _context.Impresoras.FindAsync(id);
            if (impresora == null)
            {
                return NotFound("La impresora a eliminar no fue encontrada");
            }

            try
            {
                _context.Impresoras.Remove(impresora);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("La impresora no fue Eliminada");
            }

            

            return Ok(id);
        }

        // POST: api/Impresoras
        [HttpPost]
        public async Task<ActionResult<Impresora>> PostImpresora1( Impresora impresora)
        {
            try
            {
                _context.Impresoras.Add(impresora);
                await _context.SaveChangesAsync();
            }
            catch 
            {
                return BadRequest("La Impresora No fue Guardada");
            }

            return Ok(impresora);
        }




        private bool ImpresoraExists(int id)
        {
            return _context.Impresoras.Any(e => e.IdImpresora == id);
        }
    }
}
