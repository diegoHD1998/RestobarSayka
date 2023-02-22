using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Categoria
    {
        public Categoria()
        {
            Productos = new HashSet<Producto>();
        }

        public int IdCategoria { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Color { get; set; }
        public string Estado { get; set; }
        public string Tipo { get; set; }
        public int? ImpresoraIdImpresora { get; set; }
        public string IpImpresora { get; set; }
        public virtual Impresora ImpresoraIdImpresoraNavigation { get; set; }
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
