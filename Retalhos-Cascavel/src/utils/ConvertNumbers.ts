const converNumbers=(number:string)=>{
    const NumberString = Number(number);
    const numberConvert = NumberString.toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
return numberConvert
}

export default converNumbers