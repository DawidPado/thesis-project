function validate_ratio(cross_validation_ratio){
    if(cross_validation_ratio.trim().match(/^((([1-9])+)|0):((([1-9])+)|0)$/)!= null) {
    return true;
    }
    return false
}
function number_validation(number){
     if(number.match( /^(([1-9][0-9]*)|0)$/)!=null){
         return true;
     }
     return false
}
function path_validation(path){
     if(path.match( /^((\/\w+)+|\/)$/)!=null){
         return true;
     }
     return false
}
function float_validation(path){
     if(path.match(/^(([1-9]+[0-9]*)|0)(\.((([0-9])+)|0))?$/)!=null){
         return true;
     }
     return false
}

function url_validation(path){
     if(path.match( /^((https?:\/\/)?(((0|((1[0-9]?[0-9]?)|(2[1-9]?)|(25[0-5])))\.(0|((1[0-9]?[0-9]?)|(2[1-9]?)|(25[0-5])))\.(0|((1[0-9]?[0-9]?)|(2[1-9]?)|(25[0-5])))\.(0|((1[0-9]?[0-9]?)|(2[1-9]?)|(25[0-5]))))|(localhost)|(\w+\.\w+)))(:[1-9][0-9]?[0-9]?[0-9]?[0-9]?)$/)!=null){
         return true;
     }
     return false
}
function reward_validation(path){
     if(path.match( /^(([0-9]+)|(-[0-9]+))((,(([0-9]+)|(-[0-9]+)))+)$/)!=null){
         return true;
     }
     return false
}