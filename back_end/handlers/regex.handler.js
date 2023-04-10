const regexPhoneNumberOrEmail = "(^\\+84(3|5|7|8|9)\\d{8}$)|(^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\\.[a-zA-Z]{2,}$)";
const regexPhoneNumber = "^\\+84(3|7|8|9)\\d{8}$";
const regexEmail = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
const regexNormalString = "^[a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ,-_]+$";
const regexPassword = "^[a-zA-Z0-9]+$";
const regexVehiclePlate = "^[1-9][0-9][A-Za-z][1-9]-[0-9]{5}$";

module.exports = {
    regexPhoneNumberOrEmail,
    regexPhoneNumber,
    regexEmail,
    regexNormalString,
    regexPassword,
    regexVehiclePlate
}