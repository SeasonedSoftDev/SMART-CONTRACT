export const getBigNumber = (source:any) => {
    source += '';
    const parts = source.split(".");
    let decimals = 18;
    if (parts[1] && parts[1].length) decimals -= parts[1].length;
    let zero = "0";
    if (decimals < 0) return parts[0] + parts[1].slice(0, 18);
    return parts[0] + (parts[1]?parts[1]:"") + (zero.repeat(decimals));
}