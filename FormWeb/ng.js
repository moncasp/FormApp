var app = angular.module("myApp", ["ngRoute", "ngCookies"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "login.html",
            controller:"loginCtrl"
        })
        .when("/admin", {
            templateUrl: "admin.html",
            controller:"adminCtrl"
        })
        .when("/server", {
            templateUrl: "server.html",
            controller:"serverCtrl"
        })
        .when("/user", {
            templateUrl: "user.html",
            controller:"userCtrl"
        });
});

app.controller("loginCtrl", function ($scope, $http, $location, $cookies) {
    $scope.username;
    $scope.password;
    $cookies.put("session", 0);
    $cookies.put("Conserver", 0);
    $cookies.put("userYetki", "guest");

    $scope.kayit = function () {
        if ($scope.username == null || $scope.password == null) {
            alert("bütün alanları doldurduğunuzdan emin olun");
        } else {
            $http.get("https://localhost:44367/api/Users/İsimkontrol?name=" + $scope.username).then(function (response) {
                if (response.status == 200) {
                    if (response.data == false) {
                        //kayıt yapma fonksiyonu
                        $http.get("https://localhost:44367/api/Users/UserKayit?name=" + $scope.username + "&pass=" + $scope.password + "&yetki=user").then(function (response) {
                            if (response.status == 200) {
                                if (response.data == true) {
                                    //kayıt başarılı
                                    alert("kayıt başarılı artık giriş yapabilirsiniz");
                                }
                            } else {
                                alert("bir hata oluştu");
                            }
                        });
                    } else {
                        alert("bu kullanıcı adı daha önce alınmış başka bir ad giriniz.");
                    }
                } else {
                    alert("bir hata oluştu");
                }
            });
        }

    }
    $scope.login = function () {
        if ($scope.username == null || $scope.password == null) {
            alert("bütün alanları doldurduğunuzdan emin olun");
        } else {
            $http.get("https://localhost:44367/api/Users/LoginKontrol?name=" + $scope.username + "&pass=" + $scope.password).then(function (response) {
                if (response.status == 200) {
                    if (response.data == -1) {
                        alert("kullanıcı adı yada parola yanlış tekrar deneyiniz");
                    } else {
                        //giriş başarılı
                        $cookies.put("session",response.data);
                        $http.get("https://localhost:44367/api/Users/UserInfo?userid=" + $cookies.get("session")).then(function (response) {
                            if (response.status == 200) {
                                if (response.data[0].User_authority == "user") {
                                   $cookies.put("userYetki", "user");
                                    $location.path("/user");
                                } else if (response.data[0].User_authority == "root") {
                                    $cookies.put("userYetki", "root");
                                    $location.path("/admin");
                                } else {
                                    alert("geçersiz yetki");
                                }
                            } else {
                                alert("bir hata oluştu");
                            }
                        });

                    }
                } else {
                    alert("bir hata oluştu");
                }
            });
        }

    }
    $scope.sessionControl = function () {
        if ($cookies.get("session") == 0) {
            $location.path("/");
        }
    }
    
   
});

app.controller("adminCtrl", function ($scope, $http,$location, $cookies, $window) {
    $scope.serverlist = [];

    $http.get("https://localhost:44367/api/Server/ServerList").then(function (response) {
        if (response.status == 200) {

            angular.forEach(response.data, function (item) {
                var valObj = {};
                $http.get("https://localhost:44367/api/Users/UserInfo?userid=" + item.Server_admin).then(function (response) {
                    if (response.status == 200) {
                        valObj.username = response.data[0].User_name;
                    } else {
                        alert("bir hata oluştu");
                    }
                });

                $http.get("https://localhost:44367/api/Member/UyeleriGetir?serverid=" + item.Server_id).then(function (response) {
                    if (response.status == 200) {
                        $scope.veri = 0;
                        for (i in response.data) {
                            $scope.veri++
                        }
                        valObj.oran = (($scope.veri) * 100) / item.Server_size;
                    } else {
                        alert("bir hata oluştu");
                    }
                });

                valObj.Server_id = item.Server_id;
                valObj.Server_name = item.Server_name;
                valObj.Server_size = item.Server_size;
                valObj.Server_admin = item.Server_admin;
                valObj.Server_description = item.Server_description;
                $scope.serverlist.push(valObj);
            });
        } else {
            alert("bir hata oluştu");
        }
    });

   
    $scope.userlist = [];
    $http.get("https://localhost:44367/api/Users/UserList").then(function (response) {
        if (response.status == 200) {
            $scope.userlist = response.data;
        } else {
            alert("bir hata oluştu");
        }

    });
    $scope.deleteUser = function (id) {
        $http.get("https://localhost:44367/api/Users/KullaniciSil/" + id).then(function (response) {
            console.log(response.data);
            if (response.status == 200 && response.data == true) {
                alert("kullanıcı silindi");
                $window.location.reload();
            } else {
                alert("bir hata oluştu yada  kullanıcının aktif sunucuları var");
            }
        });
    }
    $scope.connectserver = function (serverid) {
        $cookies.put("Conserver", serverid);
        $location.path("/server");
    }
    $scope.deleteserver = function (id) {
        $http.get("https://localhost:44367/api/Server/ServerDelete?serverid=" + id).then(function (response) {
            if (response.status == 200 && response.data == true) {
                alert("sunucu silindi");
                $window.location.reload();
            } else {
                alert("bir hata oluştu");
            }
        });
    }


    $scope.sessionControl = function () {
        switch ($cookies.get("userYetki")) {
            case "root":
                $location.path("/admin");
                break;
            case "user":
                $location.path("/user");
                break;
            default:
                $location.path("/");
        }
        
    }
    
    $scope.gotoHome = function () {
        
        if ($cookies.get("userYetki") == "root") {
            $location.path("/admin");
        } else if ($cookies.get("userYetki") == "user") {
            $location.path("/user");
        } else {
            $location.path("/");
        }


    }
    $scope.quit = function () {
        $cookies.put("session", 0);
        $cookies.put("Conserver", 0);
        $cookies.put("userYetki", "guest");
        $location.path("/");

    }
});



app.controller("userCtrl", function ($scope, $http, $location, $cookies, $window) {
    $scope.myServer = [];
    $http.get("https://localhost:44367/api/Server/AdminServerList?userid=" + $cookies.get("session")).then(function (response) {
        if (response.status == 200) {
            angular.forEach(response.data, function (item) {
                var valObj = {};
                $http.get("https://localhost:44367/api/Member/UyeleriGetir?serverid=" + item.Server_id).then(function (response) {
                    if (response.status == 200) {
                        $scope.veri = 0;
                        for (i in response.data) {
                            $scope.veri++
                        }
                        valObj.oran = (($scope.veri) * 100) / item.Server_size;
                    } else {
                        alert("bir hata oluştu");
                    }
                });

                valObj.Server_id = item.Server_id;
                valObj.Server_name = item.Server_name;
                valObj.Server_size = item.Server_size;
                valObj.Server_admin = item.Server_admin;
                valObj.Server_description = item.Server_description;
                $scope.myServer.push(valObj);
            });
        } else {
            alert("bir hata oluştu");
        }
    });

    $scope.uyeOlunanServerler = [];
    $http.get("https://localhost:44367/api/Member/UserServers?userid=" + $cookies.get("session")).then(function (response) {
        if (response.status == 200) {
            angular.forEach(response.data, function (gelenVeri) {
                console.log(gelenVeri.Server_id);
                $http.get("https://localhost:44367/api/Server/ServerInfo/" + gelenVeri.Server_id).then(function (response2) {
                    if (response2.status == 200) {

                        $scope.uyeOlunanServerler.push(response2.data[0]);

                    } else {
                        alert("bir hata oluştu");
                    }
                });

            });
        } else {
            alert("bir hata oluştu");
        }
    });

    $scope.uyelikSil = function (serverid) {
        $http.get("https://localhost:44367/api/Member/DeleteMem?userid=" + $cookies.get("session") + "&serverid=" + serverid).then(function (response) {
            if (response.status == 200 && response.data == true) {
                alert("üyeliğiniz silindi");
                $window.location.reload();
            } else {
                alert("bir hata oluştu");
            }
        });
    }

    $scope.yeniServer = function (newName, newSize, NewTanim) {
        $http.get("https://localhost:44367/api/Server/ServerAdd?name=" + newName + "&size=" + newSize + "&admin=" + $cookies.get("session") + "&tanim=" + NewTanim).then(function (respose) {
            if (respose.status == 200 && respose.data == true) {
                alert("sunucu açıldı");
                $window.location.reload();
            } else {
                alert("bir hata oluştu");
            }
        });
    }
    $scope.connectserver = function (serverid) {
        $cookies.put("Conserver", serverid);
        $location.path("/server");
    }
    $scope.deleteserver = function (id) {
        $http.get("https://localhost:44367/api/Server/ServerDelete?serverid=" + id).then(function (response) {
            if (response.status == 200 && response.data == true) {
                alert("sunucu silindi");
                $window.location.reload();
            } else {
                alert("bir hata oluştu");
            }
        });
    }

    $scope.gotoHome = function () {
        
        if ($cookies.get("userYetki") == "root") {
            $location.path("/admin");
        } else if ($cookies.get("userYetki") == "user") {
            $location.path("/user");
        } else {
            $location.path("/");
        }
    }

    $scope.quit = function () {
        $cookies.put("session", 0);
        $cookies.put("Conserver", 0);
        $cookies.put("userYetki", "guest");
        $location.path("/");
    }
    $scope.sessionControl = function () {
        switch ($cookies.get("userYetki")) {
            case "root":
                $location.path("/admin");
                break;
            case "user":
                $location.path("/user");
                break;
            default:
                $location.path("/");
        }

    }
});


app.controller("serverCtrl", function ($scope, $http, $location, $cookies, $window) {
    $scope.session = $cookies.get("session");
    $scope.userYetki = $cookies.get("userYetki");
    $scope.serverbilgi = [];
    $http.get("https://localhost:44367/api/Server/ServerInfo/" + $cookies.get("Conserver")).then(function (response) {
        if (response.status == 200) {
            $scope.serverbilgi = response.data
        } else {
            alert("bir hata oluştu");
        }
    });

    $scope.msgList = [];
    $http.get("https://localhost:44367/api/Msg/ServerMsgList?serverid=" + $cookies.get("Conserver")).then(function (response) {
        if (response.status == 200) {

            angular.forEach(response.data, function (item) {
                var valObj = {};
                $http.get("https://localhost:44367/api/Users/UserInfo?userid=" + item.Msg_author).then(function (response) {
                    if (response.status == 200) {
                        valObj.username = response.data[0].User_name;
                    } else {
                        alert("bir hata oluştu");
                    }
                });

                valObj.Msg_id = item.Msg_id;
                valObj.Msg_content = item.Msg_content;
                valObj.Msg_author = item.Msg_author;
                valObj.Msg_date = item.Msg_date;
                $scope.msgList.push(valObj);
            });
        } else {
            alert("bir hata oluştu");
        }
    });
    $scope.mesajSil = function (id) {
        $http.get("https://localhost:44367/api/Msg/MsgDelete?msgid=" + id).then(function (response) {
            if (response.status == 200 && response.data == true) {
                alert("mesaj silindi");
                $window.location.reload();
            } else {
                alert("bir sorun oluştu");
            }
        })
    }
    $scope.uyeList = [];
    $http.get("https://localhost:44367/api/Member/UyeleriGetir?serverid=" + $cookies.get("Conserver")).then(function (response) {
        if (response.status == 200) {

            angular.forEach(response.data, function (item) {
                var valObj = {};
                $http.get("https://localhost:44367/api/Users/UserInfo?userid=" + item.User_id).then(function (response) {
                    if (response.status == 200) {
                        valObj.username = response.data[0].User_name;
                    } else {
                        alert("bir hata oluştu");
                    }
                });

                valObj.Mem_id = item.Mem_id;
                valObj.User_id = item.User_id;
                valObj.Server_id = item.Server_id;
                $scope.uyeList.push(valObj);
            });
        } else {
            alert("bir hata oluştu");
        }
    });

    $scope.UyeSil = function (id) {
        $http.get("https://localhost:44367/api/Member/DeleteUser?userid=" + id).then(function (response) {
            if (response.status == 200 && response.data == true) {
                alert("üye sunucudan atıldı");
                $window.location.reload();
            } else {
                alert("bir sorun oluştu");
            }
        })
    }

    $scope.mesajYaz = function (mesaj) {
        $http.get("https://localhost:44367/api/Msg/AddMsg?icerik=" + mesaj + "&server=" + $cookies.get("Conserver") + "&yazar=" + $cookies.get("session")).then(function (response) {
            if (response.status == 200 && response.data == true) {
                $window.location.reload();
            } else {
                alert("bir sorun oluştu");
            }
        })
    }

    $scope.yeniuye = function (eklenecek) {
        $http.get("https://localhost:44367/api/Users/UserInfo?userid=" + $cookies.get("session")).then(function (response) {
            if (response.status == 200) {
                if (response.data[0].User_name == eklenecek) {
                    alert("kendinizi ekleyemezsiniz");
                } else {
                    $http.get("https://localhost:44367/api/Users/İsimkontrol?name=" + eklenecek).then(function (response) {
                        if (response.status == 200 && response.data == false) {
                            alert("kullanıcı bulunamadı");
                        } else {
                            $http.get("https://localhost:44367/api/Users/UsernameInfo?username=" + eklenecek).then(function (gelen) {
                                if (response.status == 200) {
                                    if (gelen.data[0].User_authority == "root") {
                                        alert("bu kullanıcıyı sunucuya ekleme yetkiniz bulunmamakta");
                                    } else {
                                        $http.get("https://localhost:44367/api/Member/AddMem?userid=" + gelen.data[0].User_id + "&serverid=" + $cookies.get("Conserver")).then(function (response) {
                                            if (response.status == 200 && response.data == true) {
                                                alert("kullanıcı sunucuya eklendi");
                                                $window.location.reload();
                                            }
                                        });
                                    }

                                }
                            });
                        }
                    });
                }
            } else {
                alert("bir hata oluştu");
            }
        });
    }
    $scope.gotoHome = function () {
        
        if ($cookies.get("userYetki") == "root") {
            $location.path("/admin");
        } else if ($cookies.get("userYetki") == "user") {
            $location.path("/user");
        } else {
            $location.path("/");
        }
    }
    $scope.quit = function () {
        $cookies.put("session", 0);
        $cookies.put("Conserver", 0);
        $cookies.put("userYetki", "guest");
        $location.path("/");

    }
    $scope.sessionControl = function () {
        if ($cookies.get("userYetki") == 'guest') $location.path("/");
    }

});



