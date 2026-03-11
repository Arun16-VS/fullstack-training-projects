// ============================================================
//  expenses.js  -  Ajax helpers for FinanceManagementSystem
// ============================================================

(function () {
    // helpers
    function formatCurrency(amount) {
        var n = Number(amount || 0);
        try {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
        } catch (e) {
            return "₹" + n.toFixed(2);
        }
    }

    function safeDate(iso) {
        if (!iso) return "-";
        var d = new Date(iso);
        return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
    }

    // ── AJAX REPORT FILTER ───────────────────────────────────────
    window.loadReport = function () {
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();

        $("#report-loading").show();
        $("#report-tbody").empty();
        $("#report-total").text("");

        $.ajax({
            url: "/Expenses/ReportData",
            type: "GET",
            data: { fromDate: fromDate, toDate: toDate },
            dataType: "json",
            cache: false
        }).done(function (data) {
            $("#report-loading").hide();

            if (!data || data.length === 0) {
                $("#report-tbody").append(
                    '<tr><td colspan="4" class="text-center text-muted">No expenses found for this period.</td></tr>'
                );
                $("#report-total").text(formatCurrency(0));
                return;
            }

            var total = 0;
            data.forEach(function (e) {
                var amount = Number(e.amount || 0);
                var row = "<tr>" +
                    "<td>" + (e.categoryName || "-") + "</td>" +
                    "<td>" + formatCurrency(amount) + "</td>" +
                    "<td>" + (e.description || "-") + "</td>" +
                    "<td>" + safeDate(e.date) + "</td>" +
                    "</tr>";
                $("#report-tbody").append(row);
                total += amount;
            });

            $("#report-total").text(formatCurrency(total));
        }).fail(function (jqXHR, textStatus, err) {
            $("#report-loading").hide();
            var msg = "Failed to load report. Please try again.";
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) msg = jqXHR.responseJSON.message;
            alert(msg);
        });
    };

    // ── AJAX DELETE EXPENSE ──────────────────────────────────────
    window.deleteExpense = function (id) {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this expense?")) return;

        var tokenInput = $('input[name="__RequestVerificationToken"]').first();
        var token = tokenInput.length ? tokenInput.val() : null;

        if (!token) {
            console.warn("__RequestVerificationToken not found on page; POST may be rejected by server.");
        }

        $.ajax({
            url: "/Expenses/DeleteAjax/" + id,
            type: "POST",
            data: token ? { __RequestVerificationToken: token } : {},
            dataType: "json"
        }).done(function (response) {
            if (response && response.success) {
                $("#expense-row-" + id).fadeOut(300, function () {
                    $(this).remove();
                    if ($("#expenses-tbody tr").length === 0) {
                        $("#expenses-tbody").append(
                            '<tr><td colspan="5" class="text-center text-muted">No expenses found.</td></tr>'
                        );
                    }
                });
                return;
            }

            var message = (response && response.message) ? response.message : "Delete failed.";
            alert(message);
        }).fail(function (jqXHR) {
            var msg = "An error occurred.";
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) msg = jqXHR.responseJSON.message;
            else if (jqXHR.status === 403) msg = "Not allowed.";
            alert(msg);
        });
    };

    // ── AJAX DELETE CATEGORY ─────────────────────────────────────
    window.deleteCategory = function (id) {
        if (!confirm("Are you sure you want to delete this category?")) return;
        var tokenInput = $('input[name="__RequestVerificationToken"]').first();
        var token = tokenInput.length ? tokenInput.val() : null;

        $.ajax({
            url: "/ExpenseCategories/DeleteAjax/" + id,
            type: "POST",
            data: token ? { __RequestVerificationToken: token } : {},
            dataType: "json"
        }).done(function (response) {
            if (response && response.success) {
                $("#category-row-" + id).fadeOut(300, function () {
                    $(this).remove();
                    if ($("#categories-tbody tr").length === 0) {
                        $("#categories-tbody").append(
                            '<tr><td colspan="2" class="text-center text-muted">No categories found.</td></tr>'
                        );
                    }
                });
                return;
            }
            alert(response && response.message ? response.message : "Delete failed.");
        }).fail(function (jqXHR) {
            var msg = (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) ? jqXHR.responseJSON.message
                : (jqXHR.status === 403 ? "Not allowed." : "An error occurred.");
            alert(msg);
        });
    };

    // delegated handler for delete links (unobtrusive)
    $(function () {
        $(document).on("click", ".delete-expense", function (e) {
            e.preventDefault();
            var id = $(this).data("id");
            if (!id) return;
            deleteExpense(id);
        });
    });
})();
