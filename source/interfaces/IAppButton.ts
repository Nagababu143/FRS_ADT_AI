export interface IAppButton{
    title:string;
    appearance?:'gradient' | 'default';
    gradients?:string[];
    onButtonPress?:()=>void;
}
