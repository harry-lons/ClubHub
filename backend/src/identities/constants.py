from .schemas import *

# TODO edit our schemas to what we want
cat_club = Club(id="2", name="Cat Club", contact_email=["cats@cats.gov"])

cat_club_board_members = ClubWithBoardMembers(
    id="2", name="Cat Club", contact_email=["cats@cats.gov"], board_members=[]
)
