/**
 * Data structure for a stack.
 */
export class Stack<T> {
    /**
     * The stack of items.
     */
    stack: T[]

    /**
     * The current size of the stack.
     */
    private size: number

    /**
     * The maximum size of the stack.
     */
    private readonly maxSize: number

    /**
     * Creates a new stack of the given capacity, optionally with some items already on it.
     */
    constructor(maxSize: number, items?: T[]) {
        this.size = 0
        this.maxSize = maxSize
        this.stack = []

        if (items && items.length > 0) {
            this.stack.push(...items)
            this.size = this.stack.length
        }
    }

    /**
     * Returns a concrete stack object. Use when processing naive message from the server.
     */
    static from<T>(stack: Stack<T>) {
        return new Stack(stack.maxSize, stack.stack)
    }

    /**
     * Returns whether the stack is empty.
     */
    isEmpty() {
        return this.size === 0
    }

    /**
     * Returns whether the stack is full.
     */
    isFull() {
        return this.size === this.maxSize
    }

    /**
     * Pushes an item to the stack.
     */
    push(item: T) {
        if (this.isFull()) {
            throw new Error("Stack overflow!")
        }

        this.stack[this.size++] = item
    }

    /**
     * Removes an item from the stack.
     */
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack underflow!')
        }

        return this.stack[--this.size]
    }

    /**
     * Returns the item at the top of the stack.
     */
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty!")
        }

        return this.stack[this.size - 1]
    }
}