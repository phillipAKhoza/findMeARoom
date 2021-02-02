$(document).ready(function () {
  $(".delete-accommodation").on("click", function (e) {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/accommodations/" + id,
      success: function (res) {
        alert("Deleting Accommodation");
        window.location.href = "/";
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});
