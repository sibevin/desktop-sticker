const Cinnamon = imports.gi.Cinnamon;
const Desklet = imports.ui.desklet;
const GLib = imports.gi.GLib;
const Settings = imports.ui.settings;
const St = imports.gi.St;
const uuid = "sticker@KaitWang";
const Gettext = imports.gettext;

function _(str) {
  return Gettext.dgettext(uuid, str);
}

Gettext.bindtextdomain(uuid, GLib.get_home_dir() + "/.local/share/locale");

function sticker(metadata, desklet_id) {
  this._init(metadata, desklet_id);
}

sticker.prototype = {
  __proto__: Desklet.Desklet.prototype,

  _init: function (metadata, desklet_id) {
    Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

    this._note = new St.Label({ style_class: "note-container" });
    this.setContent(this._note);
    this.setHeader(_("Desktop Note"));

    this.maxSize = 7000; // Cinnamon can crash if this int is too high

    this.setupUI();

    try {
      this.settings = new Settings.DeskletSettings(
        this,
        this.metadata["uuid"],
        desklet_id,
      );

      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "note-entry",
        "noteEntry",
        this.on_setting_changed,
        null,
      );
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "font-size",
        "fontSize",
        this.on_font_setting_changed,
        null,
      );
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "text-color",
        "fontColor",
        this.on_font_setting_changed,
        null,
      );
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "bg-color",
        "bgColor",
        this.on_font_setting_changed,
        null,
      );
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "pending-size",
        "pendingSize",
        this.on_font_setting_changed,
        null,
      );
      this.settings.bindProperty(
        Settings.BindingDirection.IN,
        "text-align",
        "textAlign",
        this.on_font_setting_changed,
        null,
      );
    } catch (e) {
      global.logError(e);
    }

    this.on_setting_changed();
    this.on_font_setting_changed();
  },

  on_setting_changed: function () {
    var new_text = this.noteEntry;
    this.text.set_text(new_text);
  },

  on_font_setting_changed: function () {
    this.text.style = "margin: " + this.pendingSize + "px;\n";
    this._note.style =
      "font-size: " +
      this.fontSize +
      "px;\n" +
      "color: " +
      this.fontColor +
      ";\n" +
      "background: " +
      this.bgColor +
      ";\n" +
      "text-align: " +
      this.textAlign +
      ";\n";
  },

  setupUI: function () {
    // main container for the desklet
    this.window = new St.Bin({
      style: "background: rgba(0,0,0,0);",
    });

    this.text = new St.Label();

    this.text.set_text("");
    this._note = new St.BoxLayout({
      vertical: true,
      style_class: "note-container",
    });

    this._note.add(this.text);

    this.window.add_actor(this._note);
    this.setContent(this.window);
  },
};

function main(metadata, desklet_id) {
  return new sticker(metadata, desklet_id);
}
