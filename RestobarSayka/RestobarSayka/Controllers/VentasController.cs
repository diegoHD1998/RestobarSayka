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
using RestobarSayka.Models.StoredProcedure;

namespace RestobarSayka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VentasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVenta() 
        {
            var ventas = await _context.Venta.ToListAsync();
            return Ok(ventas);
        }
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // GET api/Ventas/spVentaEmpleados
        [HttpPost("spVentaEmpleados")]
        public async Task<ActionResult<IEnumerable<SP_VentasEmpleados>>> GetVentasEmpleados(FechaDto fecha)// Recibe un parametro tipo fecha
        {
            var result = await _context.SP_VentasEmpleadoss.FromSqlInterpolated($"Exec SP_VentasEmpleados @fecha1 = {fecha.Date1}").ToListAsync();
            return Ok(result);
        }

        //Get api/Ventas/spVentasProducto
        [HttpPost("spVentasProducto")]
        public async Task<ActionResult<IEnumerable<SP_VentasProducto>>> GetVentasProducto(RangoFechaDto fecha) //Recibe 2 parametros de Fecha
        {
            var result = await _context.SP_VentasProductos.FromSqlInterpolated($"Exec SP_VentasProducto @fecha1 = {fecha.Date1} , @fecha2 = {fecha.Date2}").ToListAsync();
            return Ok(result);
        }

        //Get api/Ventas/spVentasProductoSpecific
        [HttpPost("spVentasProductoSpecific")]
        public async Task<ActionResult<IEnumerable<SP_VentasProductoSpecific>>> GetVentasProductoSpecific(RangoFechaDto fecha) //Recibe 2 parametros de Fecha
        {
            var result = await _context.SP_VentasProductoSpecifics.FromSqlInterpolated($"Exec SP_VentasProductoEspecificado @fecha1 = {fecha.Date1} , @fecha2 = {fecha.Date2}").ToListAsync();
            return Ok(result);
        }

        //Get api/Ventas/spVentasSubTotales
        [HttpPost("spVentasSubTotales")]
        public async Task<ActionResult<IEnumerable<SP_VentasSubTotales>>> GetVentasSubTotales(RangoFechaDto fecha)
        {
            var result = await _context.SP_VentasSubTotaless.FromSqlInterpolated($" Exec SP_Ventas_SubtotalesPorRango @FechaInicio = {fecha.Date1} , @FechaFin = {fecha.Date2} ").ToListAsync();

            if (result == null)
            {
                return BadRequest("Error desde backend");
            }

            return Ok(result);
        }

        //Get api/Ventas/spVentasTotales
        [HttpPost("spVentasTotales")]
        public async Task<ActionResult<IEnumerable<SP_VentasTotales>>> GetVentasTotales(RangoFechaDto fecha)
        {
            var result = await _context.SP_VentasTotaless.FromSqlInterpolated($" Exec SP_Ventas_TotalesPorRango @FechaInicio = {fecha.Date1} , @FechaFin = {fecha.Date2} ").ToListAsync();
            return Ok(result);
        }

        //GET api/Ventas/spVentasDelDia
        [HttpPost("spVentasDelDia")]
        public async Task<ActionResult<IEnumerable<SP_VentasDelDia>>> GetVentasDelDia(FechaDto fecha)
        {
            var result = await _context.SP_VentasDelDias.FromSqlInterpolated($"Exec SP_VentasDelDia @fecha1 = {fecha.Date1} ").ToListAsync();
            return Ok(result);
        }

        //GET api/Ventas/spVentasDelDiaTotales
        [HttpPost("spVentasDelDiaTotales")]
        public async Task<ActionResult<SP_VentasDelDiaTotales>> GetVentasDelDiaTotales(FechaDto fecha)
        {
            
            try
            {
                var result = _context.SP_VentasDelDiaTotales.FromSqlInterpolated($"Exec SP_VentasDelDiaTotales @fecha1 = {fecha.Date1} ");

                return Ok(result);
            }
            catch( Exception ex)
            {
                return BadRequest(ex);
            }
            
            
        }

        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            var venta = await _context.Venta.FindAsync(id);

            if (venta == null)
            {
                return NotFound();
            }

            return venta;
        }

        // PUT: api/Ventas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVenta(int id, Venta venta)
        {
            if (id != venta.IdVenta)
            {
                return BadRequest();
            }

            _context.Entry(venta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaExists(id))
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

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(Venta venta)
        {

            try
            {
                venta.Fecha = DateTime.Today;
                venta.Hora = DateTime.Now.TimeOfDay;
                _context.Venta.Add(venta);
                await _context.SaveChangesAsync();

            }
            catch(Exception ex)
            {
                return BadRequest(ex);
            }

            return Ok(venta);
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Venta.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }

            _context.Venta.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VentaExists(int id)
        {
            return _context.Venta.Any(e => e.IdVenta == id);
        }
    }
}
