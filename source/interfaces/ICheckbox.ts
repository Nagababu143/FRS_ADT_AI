export interface ICheckbox{
    label?:string;
    // onCheck:(checked:boolean)=>void;
    checked:boolean;
    setChecked:React.Dispatch<React.SetStateAction<boolean>>;
}
