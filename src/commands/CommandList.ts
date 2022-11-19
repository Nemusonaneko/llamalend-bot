import { Command } from "./Command";
import { Hello } from "./Hello";
//import { Help } from "./Help";
import { List } from "./List";
import { Loans } from "./Loans";
import { Register } from "./Register";
import { Remove } from "./Remove";

export const CommandList: Command[] = [Hello, Register, Remove, List, Loans];
