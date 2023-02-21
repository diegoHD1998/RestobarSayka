using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class OpcionModificador
    {
        public int IdOpcionM { get; set; }
        public string Nombre { get; set; }
        public int Precio { get; set; }
        public short? Orden { get; set; }
        public int ModificadorIdModificador { get; set; }

        public virtual Modificador ModificadorIdModificadorNavigation { get; set; }
    }
}
