class Product {
    constructor(public code: string, public name: string, public price: number) {}
}

class NodeRBT {
    private product: Product;
    private father!: NodeRBT;
    private leftChild!: NodeRBT;
    private rightChild!: NodeRBT;
    private color: string;

    constructor(product: Product, isLeaf?: boolean) {
        this.product = product;
        this.color = "RED";
        if (isLeaf) this.color = "BLACK"; 
    }

    public getProduct(): Product {
        return this.product;
    }

    public getData(): number {
        return this.product.price; 
    }

    public setFather(newFather: NodeRBT): void {
        this.father = newFather;
    }

    public getFather(): NodeRBT {
        return this.father;
    }

    public setLeftChild(newChild: NodeRBT): void {
        this.leftChild = newChild;
    }

    public getLeftChild(): NodeRBT {
        return this.leftChild;
    }

    public setRightChild(newChild: NodeRBT): void {
        this.rightChild = newChild;
    }

    public getRightChild(): NodeRBT {
        return this.rightChild;
    }

    public setNodeAsRed(): void {
        this.color = "RED";
    }

    public setNodeAsBlack(): void {
        this.color = "BLACK";
    }

    public getColor(): string {
        return this.color;
    }
}
// clase para crear un rbt 
class RBTree {
    private root: NodeRBT;
    private leaf: NodeRBT;

    constructor() {
        this.leaf = new NodeRBT(new Product("", "", 0), true); // Nodo hoja, color negro
        this.root = this.leaf;
    }

    // Método para corregir el balance del árbol después de la inserción
    private fixInsert(testNode: NodeRBT): void {
        while (testNode !== this.root && testNode.getFather().getColor() === "RED") {
            if (testNode.getFather() === testNode.getFather().getFather().getLeftChild()) {
                let uncle: NodeRBT = testNode.getFather().getFather().getRightChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    if (testNode === testNode.getFather().getRightChild()) {
                        testNode = testNode.getFather();
                        this.leftRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.rightRotate(testNode.getFather().getFather());
                }
            } else {
                let uncle: NodeRBT = testNode.getFather().getFather().getLeftChild();
                if (uncle.getColor() === "RED") {
                    testNode.getFather().setNodeAsBlack();
                    uncle.setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    testNode = testNode.getFather().getFather();
                } else {
                    if (testNode === testNode.getFather().getLeftChild()) {
                        testNode = testNode.getFather();
                        this.rightRotate(testNode);
                    }
                    testNode.getFather().setNodeAsBlack();
                    testNode.getFather().getFather().setNodeAsRed();
                    this.leftRotate(testNode.getFather().getFather());
                }
            }
        }
        this.root.setNodeAsBlack();
    }

    private leftRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getRightChild();
        x.setRightChild(y.getLeftChild());
        if (y.getLeftChild() !== this.leaf) y.getLeftChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getLeftChild()) x.getFather().setLeftChild(y);
        else x.getFather().setRightChild(y);
        y.setLeftChild(x);
        x.setFather(y);
    }

    private rightRotate(x: NodeRBT): void {
        let y: NodeRBT = x.getLeftChild();
        x.setLeftChild(y.getRightChild());
        if (y.getRightChild() !== this.leaf) y.getRightChild().setFather(x);
        y.setFather(x.getFather());
        if (x.getFather() === this.leaf) this.root = y;
        else if (x === x.getFather().getRightChild()) x.getFather().setRightChild(y);
        else x.getFather().setLeftChild(y);
        y.setRightChild(x);
        x.setFather(y);
    }

    public insert(product: Product): void {
        let newNode: NodeRBT = new NodeRBT(product);
        newNode.setLeftChild(this.leaf);
        newNode.setRightChild(this.leaf);
        let parent: NodeRBT = this.leaf;
        let current: NodeRBT = this.root;

        while (current !== this.leaf) {
            parent = current;
            if (newNode.getData() < current.getData()) current = current.getLeftChild();
            else current = current.getRightChild();
        }

        newNode.setFather(parent);
        if (parent === this.leaf) this.root = newNode;
        else if (newNode.getData() < parent.getData()) parent.setLeftChild(newNode);
        else parent.setRightChild(newNode);

        if (newNode.getFather() === this.leaf) {
            newNode.setNodeAsBlack();
            return;
        }
        if (newNode.getFather().getFather() === this.leaf) return;

        this.fixInsert(newNode);
    }

    private fixDelete(x: NodeRBT): void {
        while (x !== this.root && x.getColor() === "BLACK") {
            if (x === x.getFather().getLeftChild()) {
                let sibling = x.getFather().getRightChild();
                if (sibling.getColor() === "RED") {
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsRed();
                    this.leftRotate(x.getFather());
                    sibling = x.getFather().getRightChild();
                }
                if (sibling.getLeftChild().getColor() === "BLACK" && sibling.getRightChild().getColor() === "BLACK") {
                    sibling.setNodeAsRed();
                    x = x.getFather();
                } else {
                    if (sibling.getRightChild().getColor() === "BLACK") {
                        sibling.getLeftChild().setNodeAsBlack();
                        sibling.setNodeAsRed();
                        this.rightRotate(sibling);
                        sibling = x.getFather().getRightChild();
                    }
                    sibling.setNodeAsBlack();
                    x.getFather().setNodeAsBlack();
                    sibling.getRightChild().setNodeAsBlack();
                    this.leftRotate(x.getFather());
                    x = this.root;
                }
            } else {
            }
        }
        x.setNodeAsBlack();
    }

    private transplant(u: NodeRBT, v: NodeRBT): void {
        if (u.getFather() === this.leaf) {
            this.root = v;
        } else if (u === u.getFather().getLeftChild()) {
            u.getFather().setLeftChild(v);
        } else {
            u.getFather().setRightChild(v);
        }
        v.setFather(u.getFather());
    }

    public delete(price: number): void {
        let z: NodeRBT = this.search(price);
        if (z === this.leaf) return;
        let y: NodeRBT = z;
        let yOriginalColor: string = y.getColor();
        let x: NodeRBT;
        if (z.getLeftChild() === this.leaf) {
            x = z.getRightChild();
            this.transplant(z, z.getRightChild());
        } else if (z.getRightChild() === this.leaf) {
            x = z.getLeftChild();
            this.transplant(z, z.getLeftChild());
        } else {
            y = this.minimum(z.getRightChild());
            yOriginalColor = y.getColor();
            x = y.getRightChild();
            if (y.getFather() === z) {
                x.setFather(y);
            } else {
                this.transplant(y, y.getRightChild());
                y.setRightChild(z.getRightChild());
                y.getRightChild().setFather(y);
            }
            this.transplant(z, y);
            y.setLeftChild(z.getLeftChild());
            y.getLeftChild().setFather(y);
            y.setNodeAsBlack();
        }
        if (yOriginalColor === "BLACK") {
            this.fixDelete(x);
        }
    }

    private search(data: number): NodeRBT {
        let current = this.root;
        while (current !== this.leaf && current.getData() !== data) {
            if (data < current.getData()) {
                current = current.getLeftChild();
            } else {
                current = current.getRightChild();
            }
        }
        return current;
    }

    private minimum(n: NodeRBT): NodeRBT {
        while (n.getLeftChild() !== this.leaf) {
            n = n.getLeftChild();
        }
        return n;
    }

    // Consultas
    public findMin(): Product | null {
        if (this.root === this.leaf) return null;
        let node = this.root;
        while (node.getLeftChild() !== this.leaf) node = node.getLeftChild();
        return node.getProduct();
    }

    public findMax(): Product | null {
        if (this.root === this.leaf) return null;
        let node = this.root;
        while (node.getRightChild() !== this.leaf) node = node.getRightChild();
        return node.getProduct();
    }

}

// Ejemplo de uso
const storeTree = new RBTree();
storeTree.insert(new Product("001", "Producto A", 10));
storeTree.insert(new Product("002", "Producto B", 20));
storeTree.insert(new Product("003", "Producto C", 5));
storeTree.insert(new Product("004", "Producto D",  40));
storeTree.insert(new Product("005", "Producto E", 30));

// Consultas
console.log("Producto con el precio más bajo:", storeTree.findMin());
console.log("Producto con el precio más alto:", storeTree.findMax());
console.log("Productos en el rango de precios 5 a 15:", storeTree.findInRange(5, 15));