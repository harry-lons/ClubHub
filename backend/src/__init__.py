import os

from dotenv import dotenv_values, load_dotenv

# ENV stores all environment variables. We do this to import all environment variables
# in a centralized place, without having typing errors (such as with load_dotenv).
# Using load_dotenv() will have typing errors as we would use the loaded variables directly
# as python variables. Using os.environ is not possible as it will not load .env values.
# An alternative to doing this is python-decouple.
ENV = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables, if they are present
}
