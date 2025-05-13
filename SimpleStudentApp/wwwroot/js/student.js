$(document).ready(function () {
    loadStudents();

    $("#save-student").click(function () {
        var formData = {
            ad: $("#ad").val(),
            soyad: $("#soyad").val(),
            numara: $("#numara").val(),
            bolum: $("#bolum").val()
        };

        $.ajax({
            url: '/Student/AddStudent',
            type: 'POST',
            data: formData,
            success: function (response) {
                if (response.success) {
                    $('#addStudentModal').modal('hide');
                    $("#add-student-form")[0].reset();
                    loadStudents();
                    showAlert("Öğrenci başarıyla eklendi.", "success");
                } else {
                    showAlert("Hata: " + response.message, "danger");
                }
            },
            error: function (xhr) {
                showAlert("Bir hata oluştu: " + xhr.statusText, "danger");
            }
        });
    });

    $(document).on("click", ".edit-student", function () {
        var id = $(this).data("id");

        $.ajax({
            url: '/Student/GetStudent',
            type: 'GET',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    $("#edit-id").val(response.data.id);
                    $("#edit-ad").val(response.data.ad);
                    $("#edit-soyad").val(response.data.soyad);
                    $("#edit-numara").val(response.data.numara);
                    $("#edit-bolum").val(response.data.bolum);

                    $('#editStudentModal').modal('show');
                } else {
                    showAlert("Hata: " + response.message, "danger");
                }
            },
            error: function (xhr) {
                showAlert("Bir hata oluştu: " + xhr.statusText, "danger");
            }
        });
    });

    $("#update-student").click(function () {
        var formData = {
            id: $("#edit-id").val(),
            ad: $("#edit-ad").val(),
            soyad: $("#edit-soyad").val(),
            numara: $("#edit-numara").val(),
            bolum: $("#edit-bolum").val()
        };

        $.ajax({
            url: '/Student/UpdateStudent',
            type: 'POST',
            data: formData,
            success: function (response) {
                if (response.success) {
                    $('#editStudentModal').modal('hide');
                    loadStudents();
                    showAlert("Öğrenci başarıyla güncellendi.", "success");
                } else {
                    showAlert("Hata: " + response.message, "danger");
                }
            },
            error: function (xhr) {
                showAlert("Bir hata oluştu: " + xhr.statusText, "danger");
            }
        });
    });

    $(document).on("click", ".delete-student", function () {
        var id = $(this).data("id");
        $("#delete-id").val(id);
        $('#deleteStudentModal').modal('show');
    });

    $("#confirm-delete").click(function () {
        var id = $("#delete-id").val();

        $.ajax({
            url: '/Student/DeleteStudent',
            type: 'POST',
            data: { id: id },
            success: function (response) {
                if (response.success) {
                    $('#deleteStudentModal').modal('hide');
                    loadStudents();
                    showAlert("Öğrenci başarıyla silindi.", "success");
                } else {
                    showAlert("Hata: " + response.message, "danger");
                }
            },
            error: function (xhr) {
                showAlert("Bir hata oluştu: " + xhr.statusText, "danger");
            }
        });
    });
});

function loadStudents() {
    $.ajax({
        url: '/Student/GetAllStudents',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                var students = response.data;
                var tableBody = $("#student-list");
                tableBody.empty();

                if (students.length === 0) {
                    $("#no-data-message").removeClass("d-none");
                } else {
                    $("#no-data-message").addClass("d-none");

                    $.each(students, function (i, student) {
                        var row = '<tr>' +
                            '<td>' + student.id + '</td>' +
                            '<td>' + student.ad + '</td>' +
                            '<td>' + student.soyad + '</td>' +
                            '<td>' + student.numara + '</td>' +
                            '<td>' + student.bolum + '</td>' +
                            '<td>' +
                            '<button class="btn btn-sm btn-warning edit-student me-2" data-id="' + student.id + '"><i class="bi bi-pencil"></i> Düzenle</button>' +
                            '<button class="btn btn-sm btn-danger delete-student" data-id="' + student.id + '"><i class="bi bi-trash"></i> Sil</button>' +
                            '</td>' +
                            '</tr>';
                        tableBody.append(row);
                    });
                }
            } else {
                showAlert("Hata: " + response.message, "danger");
            }
        },
        error: function (xhr) {
            showAlert("Bir hata oluştu: " + xhr.statusText, "danger");
        }
    });
}

function showAlert(message, type) {
    var alertDiv = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>';

    $("#alerts-container").empty();

    $("#alerts-container").append(alertDiv);

    setTimeout(function () {
        $(".alert-dismissible").alert('close');
    }, 5000);
}