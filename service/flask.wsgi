import sys, os

#sys.path.insert(0, "F:\Flask\HelloWorld")
sys.path.insert(0, os.path.split(os.path.realpath(__file__))[0])

from manager import app

application = app