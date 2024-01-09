#!/usr/bin/env python3
"""
Flask app with Babel extension, dynamic locale selection, and gettext support
"""

from flask import Flask, render_template, request
from flask_babel import Babel, _  # Import the _ or gettext function

app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Config class with available languages and Babel settings
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    Babel locale selector using request.accept_languages
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """
    Route for the index page
    """
    # Use the _ function to translate messages
    return render_template('3-index.html', title=_("home_title"),
                           header=_("home_header"))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
