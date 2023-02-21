using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class ProductoModificador
    {
        public int ProductoIdProducto { get; set; }
        public int ModificadorIdModificador { get; set; }

        public virtual Modificador ModificadorIdModificadorNavigation { get; set; }
        public virtual Producto ProductoIdProductoNavigation { get; set; }
    }
}
