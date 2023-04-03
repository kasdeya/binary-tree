// Balanced BST
// * Height of left subtree and right subtree of root differ by at most 1.
// * Left subtree is balanced.
// * Right subtree is balanced.

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.sortedArr = array
      .filter((n, idx) => array.indexOf(n) === idx)
      .sort((a, b) => a - b);
    this.root = this.buildTree(this.sortedArr);
  }

  buildTree(array) {
    if (array.length === 0) return null;
    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);
    node.left = this.buildTree(array.slice(0, mid));
    node.right = this.buildTree(array.slice(mid + 1));
    return node;
  }

  insert(value, root = this.root) {
    let newNode = new Node(value);
    if (!root) return newNode;

    if (value > root.value) {
      if (!root.right) {
        root.right = newNode;
        return root;
      }
      return this.insert(value, root.right);
    }

    if (value < root.value) {
      if (!root.left) {
        root.left = newNode;
        return root;
      }
      return this.insert(value, root.left);
    }
    return root;
  }

  delete(value, root = this.root) {
    // traverse tree until we find value
    // once found go -> node.right once
    // then node.left untill next node.left === null
    // store node.value
    // parent of node before node.left === null has to point to node.right if it exists
    // change the node you want to delete with the store node.value
    // base case
    if (root === null) {
      return root;
    }
    // if the value to be deleted is smaller than the root then its on the left side
    if (value < root.value) {
      root.left = this.delete(value, root.left);
      // if its bigger then its on the right side
    } else if (value > root.value) {
      root.right = this.delete(value, root.right);
      // if is the same as the root, then this is the node to be deleted
    } else {
      // node has no child
      if (!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }
      // node with two children: get the smallest value in the right subtree
      // assign it to root.value
      root.value = this.minValue(root.right);

      // Delete the inorder successor
      root.right = this.delete(root.value, root.right);
    }
    return root;
  }

  minValue(node) {
    let minv = node.value;
    while (!node.left) {
      minv = node.left.value;
      node = node.left;
    }
    return minv;
  }

  find(value, root = this.root) {
    if (value === root.value) return root;
    if (value > root.value) {
      return this.find(value, root.right);
    } else {
      return this.find(value, root.left);
    }
  }

  levelOrder(callback) {
    let arr = [];
    let queue = [];
    if (!this.root) return;
    let currentNode = this.root;
    queue.push(currentNode);
    while (queue.length >= 1) {
      if (currentNode.left) {
        queue.push(currentNode.left);
      }
      if (currentNode.right) {
        queue.push(currentNode.right);
      }
      arr.push(currentNode.value);
      queue.shift();
      currentNode = queue[0];
    }

    if (!callback) {
      return arr;
    }
  }

  preorder(arr = [], node = this.root) {
    let res = [];
    if (!node) return;

    let stack = [];
    stack.push(node);
    let currentNode;
    while (stack.length !== 0) {
      currentNode = stack[stack.length - 1];
      res.push(currentNode.value);
      stack.pop();
      if (currentNode.right) {
        stack.push(currentNode.right);
      }
      if (currentNode.left) {
        stack.push(currentNode.left);
      }
    }
    return res;

    // Recursive -------------------------
    // if (!node) return
    // arr.push(node.value)
    // this.preorder( arr, node.left)
    // this.preorder( arr, node.right)
    // return arr
    // -----------------------------------
  }

  inorder(arr = [], node = this.root) {
    if (!node) return;
    this.inorder(arr, node.left);
    arr.push(node.value);
    this.inorder(arr, node.right);
    return arr;
  }

  postorder(arr = [], node = this.root) {
    if (!node) return;
    this.postorder(arr, node.left);
    this.postorder(arr, node.right);
    arr.push(node.value);
    return arr;
  }

  height(node) {
    // the longest number edges from the bottomest to the node
    if (node instanceof Node || !node) {
      if (!node) return -1;
      let leftHeight = this.height(node.left);
      let rightHeight = this.height(node.right);
      return Math.max(leftHeight, rightHeight) + 1;
    } else {
      let newNode = this.find(node);
      return this.height(newNode);
    }
  }

  depth(node) {
    // the longest number edges from the node to the root
    let edges = 0;
    let currentNode = this.root;
    while (node != currentNode.value) {
      edges++;
      if (node > currentNode.value) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }
    return edges;
  }

  isBalanced() {
    let leftHeight = this.height(this.root.left);
    let rightHeight = this.height(this.root.right);
    if (leftHeight - rightHeight > 1 || rightHeight - leftHeight > 1)
      return "This tree is not balanced";
    return "This tree is balanced";
  }

  rebalance() {
    this.root = this.buildTree(this.inorder());
    return this.printTree(this.root);
  }

  printTree(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.printTree(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.printTree(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
    return "";
  }
}

function start() {
  const array = Array(10)
    .fill()
    .map(() => Math.floor(10000 * Math.random()));
  const myTree = new Tree(array);
  console.log(myTree.printTree());
  console.log(myTree.isBalanced());
  console.log("Tree on level order");
  console.log(myTree.levelOrder());
  console.log("Tree on preorder");
  console.log(myTree.preorder());
  console.log("Tree on postorder");
  console.log(myTree.postorder());
  console.log("Tree on inorder");
  console.log(myTree.inorder());
  for (let i = 0; i < 5; i++) {
    let randNum = Math.floor(Math.random() * (1000 - 100) + 100);
    myTree.insert(randNum);
    console.log("Inserted " + randNum + " in the tree");
  }
  console.log(myTree.printTree());
  console.log(myTree.isBalanced());
  console.log(myTree.rebalance());
  console.log(myTree.isBalanced());
  console.log("Tree on level order");
  console.log(myTree.levelOrder());
  console.log("Tree on preorder");
  console.log(myTree.preorder());
  console.log("Tree on postorder");
  console.log(myTree.postorder());
  console.log("Tree on inorder");
  console.log(myTree.inorder());
}

start();

// let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// let myTree = new Tree(arr);
// // console.log(myTree)
// console.log(myTree.insert(55));
// console.log(myTree.insert(22));
// console.log(myTree.insert(500));
// console.log(myTree.insert(420));
// console.log(myTree.insert(329));
// console.log(myTree.insert(589));
// console.log(myTree.insert(2));
// // console.log(myTree.delete(4));
// // console.log(myTree.find(23));
// console.log(myTree.printTree());
// // console.log(myTree.levelOrder());
// // console.log(myTree.preorder());
// // console.log(myTree.inorder());
// // console.log(myTree.postorder());
// // console.log(myTree.height(8));
// // console.log(myTree.depth(9));
// console.log(myTree.isBalanced());
// console.log(myTree.rebalance());
// // console.log(myTree.root)
