using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Variante
    {
        public Variante()
        {
            OpcionVariantes = new HashSet<OpcionVariante>();
            Productos = new HashSet<Producto>();
        }

        public int IdVariante { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<OpcionVariante> OpcionVariantes { get; set; }
        public virtual ICollection<Producto> Productos { get; set; }
    }
}
