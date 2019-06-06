import sqlalchemy as sql
from configparser import ConfigParser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from authentication import *
from exc import *
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import Column, Integer, String, Table, ForeignKey
import logging
import atexit
import threading

Base = declarative_base()

users_groups = Table('users_groups', Base.metadata,
                     Column('user_id', Integer, ForeignKey('users.id')),
                     Column('group_id', Integer, ForeignKey('groups.id')))


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    groups = relationship('Group', secondary=users_groups, back_populates='users')

    def __repr__(self):
        return "<User: id %s; username %s>" % (self.id, self.name)

class Group(Base):
    __tablename__ = 'groups'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    users = relationship('User', secondary=users_groups, back_populates='groups')



class SqlAlchemyMeta(type):
    def __init__(self, name, bases, dct):

        # TODO: Use something other than SQLite



        try:
            config = ConfigParser()
            config.read(['sqlalchemyauthenticator.ini'])
            url = config['db']['url']
        except:
            self.fileName = '/tmp/vmemperor-auth.db'
            url = "sqlite:////tmp/vmemperor-auth.db"


        engine = create_engine(url)

        self.Session = sessionmaker(bind=engine)
        session = self.Session()

        self.sessions = dict()
        self.sessions[threading.get_ident()] = session
        #dct['session'] = self.sessions
        dct['__getattr__'] = self.__getattr__

        Base.metadata.create_all(engine)
        session.commit()
        atexit.register(self.sqlalchemy_atexit)
        super(SqlAlchemyMeta, self).__init__(name, bases, dct)

    def make_session(self):
        threadid = threading.get_ident()
        if threadid not in self.sessions:
            self.sessions[threadid] = self.Session()

        return self.sessions[threadid]

    def __getattr__(self, item):
        if item == 'session':
            return self.make_session()
        else:
            return super().__getattr__()




    def sqlalchemy_atexit(self):
        self.session.close()



class SqlAlchemyAuthenticator(BasicAuthenticator, metaclass=SqlAlchemyMeta):
    @classmethod
    def get_all_groups(cls,log=logging):
        return [
            {"id": str(item.id),
             "username": str(item.id), #no login into groups
             "name": item.name
             }
            for item in  cls.session.query(Group.id, Group.name)]

    @classmethod
    def get_all_users(cls, log=logging):
        return [
            {"id": str(item.id),
             "username": item.name, #name is a login name
             "name": item.name # you can have an additional field for full name, for example
             }
            for item in  cls.session.query(User.id, User.name)]

    @classmethod
    def get_group_name_by_id(cls, id, log=logging):
        return cls.session.query(Group.name).filter(Group.id == id).first()

    @classmethod
    def clear(cls):
        cls.session.close()

    def __getattr__(self, item):
        return getattr(type(self), item)


    def check_credentials(self, password, username, log=logging):
        self.username = username
        self.password = password
        query = self.session.query(User.id, User.name, User.password).filter(User.name == username).first()


        if not password:
            raise AuthenticationWithEmptyPasswordException(log, self)
        if not query:
            raise AuthenticationUserNotFoundException(log, self)

        if query.password != password:
            raise AuthenticationPasswordException(log, self)

        self.id = query.id



    def get_id(self):
        return str(self.id)

    def get_name(self):
        return self.session.query(User.name).filter(User.id == self.id).first()[0]

    def get_user_groups(self):
        user = self.session.query(User).filter(User.id == self.id).first()
        return {group.id : group.name for group in user.groups}













