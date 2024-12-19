export const MeseDaNumeroANome = (numeromese: string) => {
  let nome = ''
  switch (parseInt(numeromese)) {
    case 1:
      nome = 'gennaio'
      break
    case 2:
      nome = 'febbraio'
      break
    case 3:
      nome = 'marzo'
      break
    case 4:
      nome = 'aprile'
      break
    case 5:
      nome = 'maggio'
      break
    case 6:
      nome = 'giugno'
      break
    case 7:
      nome = 'luglio'
      break
    case 8:
      nome = 'agosto'
      break
    case 9:
      nome = 'settembre'
      break
    case 10:
      nome = 'ottobre'
      break
    case 11:
      nome = 'novembre'
      break
    case 12:
      nome = 'dicembre'
      break
    default:
      nome = ''
  }
  return nome
}

export const MeseDaNomeANumero = (nomemse: string) => {
  let numero = ''
  switch (nomemse) {
    case 'gennaio':
      numero = '1'
      break
    case 'febbraio':
      numero = '2'
      break
    case 'marzo':
      numero = '3'
      break
    case '4':
      numero = '4'
      break
    case 'maggio':
      numero = '5'
      break
    case 'giugno':
      numero = '6'
      break
    case 'luglio':
      numero = '7'
      break
    case 'agosto':
      numero = '8'
      break
    case 'settembre':
      numero = '9'
      break
    case 'ottobre':
      numero = '10'
      break
    case 'novembre':
      numero = '11'
      break
    case 'dicembre':
      numero = '12'
      break
    default:
      numero = ''
      break
  }
  return numero
}

export const Data_aaaammgg_ggmmaaaa = (obj: string) => {
  let tmp = ''
  if (obj) {
    const gg = obj.substr(8, 2)
    const mm = obj.substr(5, 2)
    const aaaa = obj.substr(0, 4)
    tmp = gg + '-' + mm + '-' + aaaa
  }
  return tmp
}

export const Data_ggmmaaaa_aaaammgg = (Data: string) => {
  //console.log('Data_ggmmaaa-aaammgg')
  //console.log(Data)
  let tmp = ''
  if (Data) {
    const gg = Data.substring(0, 2)
    const mm = Data.substring(3, 5)
    const aaaa = Data.substring(6, 10)
    tmp = aaaa + '-' + mm + '-' + gg
  }
  // console.log(aaaa, mm, gg, tmp)

  return tmp
}
export const Data_NewDate_aaaammgg = (Data: Date) => {
  //console.log('p', Data)
  let Giorno = Data.getDate().toString()
  let Mese = (Data.getMonth() + 1).toString()
  const Anno = Data.getFullYear()
  if (parseInt(Giorno) < 10) {
    Giorno = '0' + Giorno
  }
  if (parseInt(Mese) < 10) {
    Mese = '0' + Mese
  }
  const tmp = Anno + '-' + Mese + '-' + Giorno
  return tmp
}
export const Data_NewDate_ggmmaaaa = (Data: Date) => {
  //console.log('p', Data)
  let Giorno = Data.getDate().toString()
  let Mese = (Data.getMonth() + 1).toString()
  const Anno = Data.getFullYear()
  if (parseInt(Giorno) < 10) {
    Giorno = '0' + Giorno
  }
  if (parseInt(Mese) < 10) {
    Mese = '0' + Mese
  }
  const tmp = Giorno + '-' + Mese + '-' + Anno
  return tmp
}
export const DataOggiInglese = () => {
  const DataDiOggi = new Date()
  let Giorno = DataDiOggi.getDate().toString()
  let Mese = (DataDiOggi.getMonth() + 1).toString()
  const Anno = DataDiOggi.getFullYear()
  if (parseInt(Giorno) < 10) {
    Giorno = '0' + Giorno
  }
  if (parseInt(Mese) < 10) {
    Mese = '0' + Mese
  }
  const tmp = Anno + '-' + Mese + '-' + Giorno
  //console.log(tmp)
  return tmp
}

export const TestAzioneSalva = (Test: boolean, Tipo: string) => {
  //console.log(Tipo, Test)
  let tmp: string | boolean = ''
  if (Test) {
    tmp = Tipo === 'd' ? true : 'Disabilitato'
  } else {
    tmp = Tipo === 'd' ? false : 'Salva'
  }
  return tmp
}
/*
export const Round = (num: number, decimals: number) => {
  /*
  if (num===-10800)
  console.log(num)  
  const t = Math.pow(10, decimals)
  let tmp
  if (num != 0) {
    tmp = (
      Math.round(
        num * t + (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / Math.pow(100, decimals)))
      ) / t
    ).toFixed(decimals)
    const intero = Math.trunc(parseInt(tmp)).toString()
    if (intero.length > 3) {
      tmp = tmp.replace('.', ',')
      tmp = tmp.toString().substring(0, tmp.length - 6) + '.' + tmp.substring(1, tmp.length)
    } else {
      tmp = tmp.replace('.', ',')
    }
  }
  if (num===-10800)
    console.log(tmp != 'NaN' ? (tmp != '0' ? (tmp != null ? tmp : '') : '') : '')    
  return num //tmp != 'NaN' ? (tmp != '0' ? (tmp != null ? tmp : '') : '') : ''
  /
}
*/
export const formatEuro = (amount: any) => {
  let numreturn: any = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
  numreturn = numreturn === 'NaN' ? '': numreturn
  return numreturn
}
