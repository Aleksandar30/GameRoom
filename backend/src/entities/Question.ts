import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    question!: string

    @Column()
    optionA!: string

    @Column()
    optionB!: string

    @Column()
    optionC!: string

    @Column()
    optionD!: string

    @Column({ type: "enum", enum: ["A", "B", "C", "D"] })
    correctOption!: "A" | "B" | "C" | "D"
}
