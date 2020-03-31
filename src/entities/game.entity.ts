import { Entity, Column, ObjectIdColumn, Timestamp } from 'typeorm';
import { ArgusModel } from '../models/argus';

export enum GameState {
    NEW = "nouveau",
    SECOND_HAND = "occasion"
}

export enum GameStatus {
    BUY = "acheté",
    TO_BOUGHT = "à acheter"
}

export type GameContent = "jeu" | "boite" | "manuel";

@Entity('Game')
export class GameEntity {

    @ObjectIdColumn()
    private id!: string;

    @Column({ length: 50 })
    console: string;

    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: GameState,
        default: GameState.NEW
    })
    state: GameState;

    @Column()
    buyPrice: number;

    @Column()
    basePrice: number;

    @Column()
    argusUrl: string;

    @Column()
    argus: ArgusModel[];

    @Column()
    releaseDate: Date;

    @Column()
    buyDate: Date;

    @Column()
    buyLocation: String;

    @Column({
        type: "enum",
        enum: GameStatus,
        default: GameStatus.TO_BOUGHT
    })
    status: GameStatus;

    @Column({
        type: "set",
        enum: ["jeu", "boite", "manuel"],
        default: ["jeu", "boite", "manuel"]
    })
    content: GameContent[];

    @Column()
    comment: String;

    @Column()
    thumbnail: String;

    get Id() {
        return this.id.toString();
    }
}