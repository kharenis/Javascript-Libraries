$(function () {
    $('.data-table').each(function () {
        var pagination = new Pagination($(this));
        pagination.Init();
        paginationTables.push(pagination);
    });
});

var paginationTables = [];


class Pagination {
    DataSource = '';
    Start = 0;
    RowsPerPage = 0;
    Table = null;
    Columns = [];
    CachedData = [];
    ServerDatasetLength = 0;
    CurrentPage = 0;
    SortColumn = "Id";
    SortDirection = "descending";

    Init() {
        let self = this;

        this.DataSource = this.Table.data('source');
        this.RowsPerPage = this.Table.data('count');

        let next = this.Table.data('next');
        let previous = this.Table.data('previous');

        let pageChange = this.Table.data('page-entry');

        $(next).click(function () {
            self.Next();
        });
        $(previous).click(function () {
            self.Prev();
        });

        $(pageChange).on('change', function () {
            let val = $(this).val();
            self.PageChange(val);
        });

        this.Table.find('[data-search-column]').on('change', function () {
            self.CachedData = [];
            self.PageChange(0);
        });

        let columns = this.Table.find('[data-column]');

        columns.each(function () {
            var columnName = $(this).data('column');

            $(this).find('span').click(function () {
                 self.SortChange(columnName);
            });

            self.Columns.push(columnName);
        });

        this.GetData();
    }

    DisplayData(start, rowsPerPage) {
        let self = this;
        let end = start + rowsPerPage;

        let currentPage = (start / rowsPerPage) + 1;

        var tableBody = $(self.Table).find('.data-table-body');

        //Clear the table
        $(tableBody).empty();

        //Fill the table with the current page
        for (var rowCount = start; rowCount < end; rowCount++) {

            if (rowCount >= self.CachedData.length) break;

            var row = document.createElement('div');
            row.classList.add('row');
            $(tableBody).append(row);
            for (var i = 0; i < self.Columns.length; i++) {
                let col = self.Columns[i];
                var val = self.CachedData[rowCount][col];
                $(row).append('<div class="col-md-4">' + val + '</div>');
                //$(row).append('<div data-col="'+col+'" data-val="'+val+'" class="col-md-4">' + val + '</div>');
            }
        }

        $(self.Table).find('.data-table-nav .data-table-current-page').val(currentPage);
        $(self.Table).find('.data-table-nav .data-table-page-count').text(Math.ceil(this.ServerDatasetLength / rowsPerPage));

    }

    GetData() {
        let self = this;

        if (this.Start < self.CachedData.length) {
            self.DisplayData(self.Start, self.RowsPerPage);
            return;
        }
        var filters = null;// [];
        this.Table.find('[data-search-column]').each(function () {
            var obj = { key: $(this).data('search-column'), value: $(this).val() };
            if (obj.value !== "") {
                if (!filters) filters = new Object();
                filters[obj.key] = obj.value;
            }
                //filters.push(obj);
        });

        Ajax.Get(this.DataSource, { start: self.Start, count: self.RowsPerPage, sortColumn: self.SortColumn, sortDirection: self.SortDirection, filters: filters }, 'json')
            .done(function (data) {
                self.CachedData = self.CachedData.concat(data.data);
                self.ServerDatasetLength = data.count;
                self.DisplayData(self.Start, self.RowsPerPage);
            }).fail(function (error) {
                alert(error);
            });
    }

    SortChange(col) {
        if (col === this.SortColumn) {
            if (this.SortDirection == "ascending")
                this.SortDirection = "descending";
            else
                this.SortDirection = "ascending";
        }
        else {
            this.SortColumn = col;
        }
        this.CachedData = [];
        this.PageChange(0); //Reset data because things have changed!
    }

    PageChange(page) {
        if (page < 0) page = 0;

        let max = Math.ceil(this.ServerDatasetLength / this.RowsPerPage);
        if (page >= max) page = max - 1;

        this.CurrentPage = page;
        this.Start = page * this.RowsPerPage;
        this.GetData();
    }

    Next() {
        this.PageChange(this.CurrentPage + 1);
    }

    Prev() {
        this.PageChange(this.CurrentPage - 1);
    }

    constructor($table) {
        this.Table = $table;
    }
}
