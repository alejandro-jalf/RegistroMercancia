var app = new Vue({
    el: "#app",
    data: {
        products: JSON.parse(window.localStorage.getItem("products"))|| [],
        warnings: [],
        warningsEdit: [],
        ProveedorName: "",
        CodigoBarrasName: "",
        ProductoName: "",
        UnidadName: "",
        CantidadName: "",
        tableProducts: 0,
        dataEdit: {codigo: "", name: "", unidad: "", cantidad: ""},
        productSelect: "",
        proveedorActual: window.localStorage.getItem("proveedor") || ""
    },
    mounted: function() {
        this.$refs.addRegister.addEventListener('click', this.handleRegister);
        this.$refs.cleanCamps.addEventListener('click', this.handleClean);
    },
    methods: {
        forceUpdate: function() {
            this.tableProducts += 1;
        },
        handleRegister: function() {
            this.validaDatos();
            if ((this.warnings).length === 0) {
                this.addProduct(this.CodigoBarrasName, this.ProductoName, this.UnidadName, this.CantidadName);
                this.cleanCell();
                this.forceUpdate();
            }
        },
        addProduct: function(codigo, name, unidad, cantidad) {
            (this.products).push({codigo, name, unidad, cantidad});
            const stringJoson = JSON.stringify(this.products);
            window.localStorage.setItem("products", stringJoson);
            if (this.proveedorActual.trim().length === 0) {
                this.proveedorActual = this.ProveedorName;
                window.localStorage.setItem("proveedor", this.ProveedorName);
            }
        },
        setRegisterSelect: function({...register}) {
            this.setProductSelect(register.codigo);
            this.dataEdit = register;
        },
        updateProduct: function() {
            this.validaDatosEdit();
            if ((this.warningsEdit).length === 0) {
                const arrayProducts = this.products.map((element) => {
                    const elementToReturn = (element.codigo === this.productSelect) ? this.dataEdit : element;
                    return elementToReturn;
                });
                this.products = arrayProducts;
                this.$refs.cancelEdit.click();
            }
        },
        setProductSelect: function(product) {
            this.productSelect = product;
        },
        removeProducto: function() {
            const arrayProducts = this.products.filter((element) => element.codigo !== this.productSelect);
            this.products = arrayProducts;
            const stringJoson = JSON.stringify(this.products);
            window.localStorage.setItem("products", stringJoson);
            if (this.products.length === 0) {
                this.proveedorActual = "";
                window.localStorage.setItem("proveedor", this.ProveedorName);
            }
        },
        handleClean: function() {
            this.cleanCell();
            this.ProveedorName = "";
        },
        cleanCell: function() {
            this.warnings = [];
            this.CodigoBarrasName ="";
            this.ProductoName ="";
            this.UnidadNam = "";
            this.CantidadName = "";
        },
        validaDatos: function() {
            this.warnings = [];
            console.log((/^[0-9]+$/g.test(this.CodigoBarrasName)));
            if ((this.ProveedorName).trim() === "") (this.warnings).push("Falta seleccionar un Proveedor");
            if ((this.CodigoBarrasName).trim() === "") (this.warnings).push("Falta ingresar codigo de barras");
            if ((this.ProductoName).trim() === "") (this.warnings).push("Falta ingresar producto");
            if ((this.UnidadName).trim() === "") (this.warnings).push("Falta seleccionar unidad");
            if ((this.CantidadName).trim() === "") (this.warnings).push("Falta ingresar cantidad");
            
            if ((this.warnings).length > 0) return true;

            if(!(/^[0-9]+$/g.test(this.CodigoBarrasName))) (this.warnings).push("Codigo de barras debe ser numero");
            if(!(/^([0-9]+.*[0-9]+)$|^([0-9]+)$/g.test(this.CantidadName))) (this.warnings).push("Cantidad debe ser numero");
        },
        validaDatosEdit: function() {
            this.warningsEdit = [];
            if ((this.dataEdit.codigo).trim() === "") (this.warningsEdit).push("Falta ingresar codigo de barras");
            if ((this.dataEdit.name).trim() === "") (this.warningsEdit).push("Falta ingresar producto");
            if ((this.dataEdit.unidad).trim() === "") (this.warningsEdit).push("Falta seleccionar unidad");
            if ((this.dataEdit.cantidad).trim() === "") (this.warningsEdit).push("Falta ingresar cantidad");
            
            if ((this.warningsEdit).length > 0) return true;

            if(!(/^[0-9]+$/g.test(this.dataEdit.codigo))) (this.warningsEdit).push("Codigo de barras debe ser numero");
            if(!(/^([0-9]+.*[0-9]+)$|^([0-9]+)$/g.test(this.dataEdit.cantidad))) (this.warningsEdit).push("Cantidad debe ser numero");
        },
        removeAllRegister: function() {
            this.products = [];
            window.localStorage.setItem("products", this.products);
            this.proveedorActual = "";
            window.localStorage.setItem("proveedor", "");
        }
    }
});
