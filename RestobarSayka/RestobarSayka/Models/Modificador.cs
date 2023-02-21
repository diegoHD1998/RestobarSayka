using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Modificador
    {
        public Modificador()
        {
            OpcionModificadors = new HashSet<OpcionModificador>();
            ProductoModificadors = new HashSet<ProductoModificador>();
        }

        public int IdModificador { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<OpcionModificador> OpcionModificadors { get; set; }
        public virtual ICollection<ProductoModificador> ProductoModificadors { get; set; }
    }
}
