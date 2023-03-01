using System;
using System.Collections.Generic;
using System.IO;
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
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            try
            {
                var productos = await _context.Productos.ToListAsync();
                return Ok(productos);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Productos/productosActivos
        [HttpGet("productosActivos")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetproductosActivos()
        {
            var productos = await _context.Productos.Where(p => p.Estado == "Activo").ToListAsync();

            if (productos == null)
            {
                return NotFound("Productos Activos No Encontrados");
            }

            return Ok(productos);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound("Producto No Encontrado");
            }

            return Ok(producto);
        }

        // PUT: api/Productos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.IdProducto)
            {
                return BadRequest("Los Ids de Producto No Coinciden");
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound("No se a Encontrado el Producto a Modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProducto", new { id = producto.IdProducto }, producto);
        }

        // POST: api/Productos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            try
            {
                _context.Productos.Add(producto);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("El Producto No fue Guardado");
            }

            return CreatedAtAction("GetProducto", new { id = producto.IdProducto }, producto);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound("Producto No Encontrado");
            }

            try
            {
                _context.Productos.Remove(producto);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("El Producto No fue Eliminado");
                //return BadRequest(ex);
            }


            return Ok(id);
        }
        [HttpPost("CargarImagen")]
        public Task<bool> UploadFile()
        {
            //Variable que retorna el valor del resultado del metodo
            //El valor predeterminado es Falso (false)
            bool resultado = false;

            //La variable "file" recibe el archivo en el objeto Request.Form
            //Del POST que realiza la aplicacion a este servicio.
            //Se envia un formulario completo donde uno de los valores es el archivo
            var file = Request.Form.Files[0];

            //Variable donde se coloca la ruta relativa de la carpeta de destino
            //del archivo cargado
            string RutaCompleta = "C:\\Users\\diego\\Desktop\\RestobarSayka\\FrontEnd2\\public\\assets\\layout\\images\\";
            //string RutaCompleta = "C:\\DBNET-GITHUB\\RestobarSayka\\RestobarSayka\\RestobarSayka\\imagen\\";
            //Variable donde se coloca la ruta raíz de la aplicacion
            //para esto se emplea la variable "_env" antes de declarada
            // string RutaRaiz = _env.ContentRootPath;

            //Se concatena las variables "RutaRaiz" y "NombreCarpeta"
            //en una otra variable "RutaCompleta"
            //string RutaCompleta = RutaRaiz + NombreCarpeta;


            //Se valida con la variable "RutaCompleta" si existe dicha carpeta            
            if (!Directory.Exists(RutaCompleta))
            {
                //En caso de no existir se crea esa carpeta
                Directory.CreateDirectory(RutaCompleta);
            }

            //Se valida si la variable "file" tiene algun archivo
            if (file.Length > 0)
            {
                //Se declara en esta variable el nombre del archivo cargado
                string NombreArchivo = file.FileName;

                //Se declara en esta variable la ruta completa con el nombre del archivo
                string RutaFullCompleta = Path.Combine(RutaCompleta, NombreArchivo);

                //Se crea una variable FileStream para carlo en la ruta definida
                using (var stream = new FileStream(RutaFullCompleta, FileMode.Create))
                {
                    file.CopyTo(stream);

                    //Como se cargo correctamente el archivo
                    //la variable "resultado" llena el valor "true"
                    resultado = true;
                }

            }

            //Se retorna la variable "resultado" como resultado de una tarea
            return Task.FromResult(resultado);

        }
        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.IdProducto == id);
        }
    }
}
