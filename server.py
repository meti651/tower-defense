from flask import Flask, render_template, request, redirect

app = Flask(__name__)

@app.route("/")
def index():
    return redirect("/game")


@app.route("/game")
def game():
    return render_template()

if __name__ == "__main__":
    app.run(Debug=True)