var objectQuagga = {initQuagga: () => {console.log("init ");}};
var app = new Vue({
    el: "#app",
    data: {
        products: JSON.parse(localStorage.getItem("products")) || [],
        warnings: [],
        warningsEdit: [],
        ProveedorName: "vacio", 
        CodigoBarrasName: "",
        ProductoName: "",
        UnidadName: "",
        CantidadName: "",
        tableProducts: 0,
        dataEdit: {codigo: "", name: "", unidad: "", cantidad: ""},
        productSelect: "",
        proveedorActual: localStorage.getItem("proveedor") || "",
        otroProveedor: false,
        editPrducto: 0,
        lectorVisible: false,
        scannerActivo: false
    },
    mounted: function() {
        this.$refs.addRegister.addEventListener('click', this.handleRegister);
        this.$refs.cleanCamps.addEventListener('click', this.handleClean);
    },
    methods: {
        activateLector: function () {
            this.lectorVisible = true;
        },
        activateScanner: function () {
            objectQuagga.initQuagga();
            this.scannerActivo = true;
            console.log("enciende");
        },
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
            this.setProductsInLocalStorage(this.products);
            if (this.proveedorActual.trim().length === 0) {
                this.proveedorActual = this.ProveedorName;
                localStorage.setItem("proveedor", this.ProveedorName);
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
                this.setProductsInLocalStorage(arrayProducts);
                this.$refs.cancelEdit.click();
            }
        },
        setProductSelect: function(product) {
            this.productSelect = product;
        },
        removeProducto: function() {
            if (this.products.length <= 1) {
                this.removeAllRegister();
                this.editPrducto += 1;
            } else {
                const arrayProducts = this.products.filter((element) => element.codigo !== this.productSelect);
                this.setProductsInLocalStorage(arrayProducts);
            }
        },
        handleClean: function() {
            this.cleanCell();
            this.ProveedorName = this.proveedorActual;
        },
        cleanCell: function() {
            this.warnings = [];
            this.CodigoBarrasName ="";
            this.ProductoName ="";
            this.UnidadNam = "";
            this.CantidadName = "";
            this.lectorVisible = false;
        },
        validaDatos: function() {
            this.warnings = [];
            if ((this.ProveedorName).trim() === "" || (this.ProveedorName).trim() === "vacio") (this.warnings).push("Falta seleccionar un Proveedor");
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
            this.proveedorActual = "";
            this.ProveedorName = "vacio";
            this.otroProveedor = false;
            localStorage.clear();
        },
        verifyProveedorSelected: function() {
            this.otroProveedor = (this.ProveedorName === "");
        },
        bakcToSelect: function() {
            this.ProveedorName = "vacio";
            this.otroProveedor = false;
        },
        createFile: function() {
            var hoy = new Date();
            var CsvString = `Proveedor,${this.proveedorActual}, ,Fecha,${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}\r\n\r\n`;
            CsvString += "Codigo de barras,Producto,Unidad,Cantidad\r\n"
            this.products.map( product => {
                CsvString += `${product.codigo},${product.name},${product.unidad},${product.cantidad}\r\n`;
            });
            CsvString = "data:application/csv," + encodeURIComponent(CsvString);
            var x = document.createElement("A");
            x.setAttribute("href", CsvString );
            x.setAttribute("download",`Registro Mercancia ${this.proveedorActual} - ${hoy.getFullYear()} ${hoy.getMonth() + 1}${hoy.getDate()} T${hoy.getHours()}${hoy.getMinutes()}.csv`);
            document.body.appendChild(x);
            x.click();
        },
        setProductsInLocalStorage: function(newArrayProducts) {
            this.products = newArrayProducts;
            const stringJoson = JSON.stringify(this.products);
            localStorage.setItem("products", stringJoson);
        }
    }
});
