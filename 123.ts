// @ts-ignore
function spaceString(str)
{
    let strs = [];
    if (str.length == 1)
    {
        strs.push(str);
        return strs;
    }

    let strsTemp = spaceString(str.substring(1, str.length));

    for (let i = 0; i < strsTemp.length; i++)
    {
        strs.push(str[0] + strsTemp[i]);
        strs.push(str[0] + "." + strsTemp[i]);
    }

    return strs;
}

let patterns = spaceString("ABCD");