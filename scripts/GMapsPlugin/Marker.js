function Marker(markerOptions) {

    // fields
    this.options = markerOptions;
    debugger;
    // position option preparing
    if (!this.options.position) { // not alternative 3

        //alternative 2
        if (this.options.latitude &&
            this.options.longitude) {

            this.options.position = new google.maps.LatLng(this.options.latitude,
                                                          this.options.longitude);
        } else {

            // alternative 1
            if (this.options.placeName) {
                // TODO code this alternative
            }
        }
    }

    
    this.marker = new google.maps.Marker(this.options);

    this.message = markerOptions.message;
    this.isEditable = markerOptions.isEditable;
    this.infoWindow = undefined;
    this.$content = undefined;
    this.$input = undefined;
    this.$label = undefined;

    // methods
    this.addInfoWindow = function (settings) {

        var self = this;

        this.$content = settings.$markerContent.clone();
        this.$content.addClass('marker-content-cloned');
        // if content was hidden
        // TODO what if some blocks
        //      MUST have display:none ?
        this.$content.show();
        this.$content.find('*').show();
        self.endEdit();

        this.$input = this.$content.find('.marker-input');
        this.$label = this.$content.find('.marker-label');

        if (this.message) {
            console.log('Adding message:' + this.message);
            this.$input.attr('value', this.message);
            this.$label.html(this.message);
        }

        // show edit controls if is editable
        self.startEdit();

        this.$input.on('keyup', function () {

            self.message = self.$input[0].value;
            self.$label.html(self.message);

        });

        // enable input by label clicking
        this.$label.on('click', function () {
            self.startEdit();
        });

        // disable input on enter
        this.$input.on('change', function () {

            self.message = self.$input[0].value;
            self.$label.html(self.message);
            self.endEdit();
        });

        this.infoWindow = new google.maps.InfoWindow({
            content: this.$content[0]
        });

        return this.infoWindow;
    };

    this.startEdit = function () {
        if (this.isEditable === true) {
            this.$content.find('.marker-input-group').show();
        }
    };

    this.endEdit = function () {
        console.log('end edit');
        this.$content.find('.marker-input-group').hide();
    };

    this.showInfoWindow = function () {
        this.infoWindow.open(this.options.map, this.marker);
    };

    this.addEvents = function () {
        var self = this;
        google.maps.event.addListener(this.marker, 'click', function () {
            self.showInfoWindow();
        });
    };
    
    this.addToMap = function() {
        
    }
}