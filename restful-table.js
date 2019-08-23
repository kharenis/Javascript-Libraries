$(function () {
    $('[data-rt="true"]').each(function () {
        var restfulTable = new RestfulTable($(this));
        restfulTable.Init();
        restfulTables.push(restfulTable);
    });
});

var restfulTables = [];


class RestfulTable {
    InitializeNav(table) {
        var self = this;
        var navContainer = document.createElement('div');
        navContainer.setAttribute('class', 'row rt-nav');

        var backBtnContainer = document.createElement('div');
        var backBtn = document.createElement('button');
        backBtn.setAttribute('type', 'button');
        backBtn.classList.add('rt-nav-prev');
        backBtnContainer.append(backBtn);

        var pageChangeContainer = document.createElement('div');
        var pageChangeInput = document.createElement('input');
        pageChangeInput.setAttribute('type', 'text');
        pageChangeInput.setAttribute('value', 1);
        pageChangeInput.setAttribute('class', 'rt-current-page');
        var pageChangeText = document.createElement('span');
        pageChangeText.innerText = 'of';
        var pageChangeCount = document.createElement('span');
        pageChangeCount.classList.add('rt-page-count');

        pageChangeContainer.append(pageChangeInput);
        pageChangeContainer.append(pageChangeText);
        pageChangeContainer.append(pageChangeCount);

        var forwardBtnContainer = document.createElement('div');
        var forwardBtn = document.createElement('button');
        forwardBtn.setAttribute('type', 'button');
        forwardBtn.classList.add('rt-nav-next');
        forwardBtnContainer.append(forwardBtn);

        navContainer.append(backBtnContainer);
        navContainer.append(pageChangeContainer);
        navContainer.append(forwardBtnContainer);

        $(table).append(navContainer);

        $(backBtn).click(function () {
            self.Prev();
        });

        $(forwardBtn).click(function () {
            self.Next();
        });

        $(pageChangeInput).on('change', function () {
            let val = $(this).val();
            self.PageChange(val);
        });
    }

    Init() {
        let self = this;

        this.DataSource = this.Table.data('rt-source');
        this.RowsPerPage = this.Table.data('rt-row-count');

        let postRenderStr = this.Table.data('rt-post-render');
        if (postRenderStr)
            self.PostRender = window[postRenderStr];

        this.Table.find('[data-rt-search-column]').on('change', function () {
            self.CachedData = [];
            self.PageChange(0);
        });

        let columns = this.Table.find('[data-rt-column]');

        columns.each(function () {
            var columnName = $(this).data('rt-column');

            $(this).find('span').click(function () {
                self.SortChange(columnName);
            });

            self.Columns.push(columnName);
        });

        var val = this.Table.data('rt-paginate');
        if (this.Table.data('rt-paginate') === true)
            this.InitializeNav(this.Table);

        this.GetData();
    }

    DisplayData(start, rowsPerPage) {
        let self = this;
        let end = start + rowsPerPage;

        if (end === undefined || isNaN(end)) end = this.CachedData.length;

        let currentPage = (start / rowsPerPage) + 1;

        var tableBody = $(self.Table).find('.rt-body');

        //Clear the table
        $(tableBody).empty();

        //Fill the table with the current page
        for (var rowCount = start; rowCount < end; rowCount++) {

            if (rowCount >= self.CachedData.length) break;

            var row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('rt-row');
            $(tableBody).append(row);
            for (var i = 0; i < self.Columns.length; i++) {
                let col = self.Columns[i];
                let val = self.CachedData[rowCount][col];

                let column = document.createElement('div');
                column.classList.add('col-md-4');

                row.setAttribute('data-' + col, val);
                column.textContent = val;

                $(row).append(column);
                //$(row).append('<div data-col="'+col+'" data-val="'+val+'" class="col-md-4">' + val + '</div>');
            }
        }

        $(self.Table).find('.rt-nav .rt-current-page').val(currentPage);
        $(self.Table).find('.rt-nav .rt-page-count').text(Math.ceil(this.ServerDatasetLength / rowsPerPage));

        if (self.PostRender)
            self.PostRender(self.Table);

    }

    GetData() {
        let self = this;

        if (this.Start < self.CachedData.length) {
            self.DisplayData(self.Start, self.RowsPerPage);
            return;
        }
        var filters = null;// [];
        this.Table.find('[data-rt-search-column]').each(function () {
            var obj = { key: $(this).data('rt-search-column'), value: $(this).val() };
            if (obj.value !== "") {
                if (!filters) filters = new Object();
                filters[obj.key] = obj.value;
            }
            //filters.push(obj);
        });

        let sort = self.SortColumn + ' ' + self.SortDirection;

        Ajax.Get(this.DataSource, { start: self.Start, count: self.RowsPerPage, sort: sort, filters: filters }, 'json')
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
            if (this.SortDirection === "ascending")
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
        this.DataSource = '';
        this.Start = 0;
        this.RowsPerPage = 0;
        this.Columns = [];
        this.CachedData = [];
        this.ServerDatasetLength = 0;
        this.CurrentPage = 0;
        this.SortColumn = "Id";
        this.SortDirection = "descending";
        this.PostRender = null;
    }
}
