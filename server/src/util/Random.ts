/**
 * Provides utility methods for random generation.
 */
export class Random {
    /**
     * Returns a random integer between 0 and (length - 1) inclusive.
     */
    static index(length: number) {
        let indexes = [...Array(length).keys()]
        return Math.floor(Math.random() * indexes.length)
    }

    /**
     * Returns a list of the given length of random numbers from the given range.
     */
    static fromList(range: number[], count: number) {
        let result = []

        for (let i = 0; i < count; i++) {
            result.push(this.oneFromList(range))
        }

        return result
    }

    /**
     * Returns a random number from the given range.
     */
    static oneFromList(range: number[]) {
        // choose item at random index
        let index = Math.floor(Math.random() * range.length)
        let choice = range[index]

        // remove it from the range so it's not selected again
        range.splice(index, 1)

        return choice
    }

    /**
     * Randomly shuffles the given array.
     * Adapted from https://stackoverflow.com/a/12646864
     */
    static shuffleArray<T>(arr: T[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}