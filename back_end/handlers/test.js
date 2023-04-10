const validateString = (str, regex) => {
    // Check if the string is not empty
    if (!str || str.trim().length === 0) {
        return false;
    }

    // Check if the string matches the regular expression
    if (!str.match(regex)) {
        return false;
    }
    return true;
}



const regexPhoneNumberOrEmail = "(^\\+84(3|5|7|8|9)\\d{8}$)|(^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\\.[a-zA-Z]{2,}$)";
const regexPhoneNumber = "^\\+84(3|7|8|9)\\d{8}$";
const regexEmail = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
const regexNormalString = "^[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ,-_]+$";
const regexPassword = "^[a-zA-Z0-9]+$";
const regexVehiclePlate = "^[1-9][0-9][A-Za-z][1-9]-[0-9]{5}$";


console.log(validateString('bean132-', regexNormalString), "PHONE VALID")
console.log(validateString('abc', regexNormalString), "PHONE VALID")
console.log(validateString(':111@gmail.com', regexNormalString), "PHONE VALID")
console.log(validateString('Văn phòng Mĩ Đình', regexNormalString), "PHONE VALID")
console.log(validateString('108 Trần Thái Tông, Dịch Vọng, Cầu Giấy, Hà Nội', regexNormalString), "PHONE VALID")
