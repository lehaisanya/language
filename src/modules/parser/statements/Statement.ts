export abstract class Statement {
    public name: string

    constructor(name: string) {
        this.name = name
    }

    public toString(): string {
        return JSON.stringify(this, null, 2)
    }
}
