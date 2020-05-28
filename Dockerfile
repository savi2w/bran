FROM archlinux/base
LABEL maintainer="weslenng"

RUN echo 'Server = http://linorg.usp.br/archlinux/$repo/os/$arch' > /etc/pacman.d/mirrorlist
RUN pacman -Syu --noconfirm chromium gcc git make nodejs yarn

WORKDIR /app

RUN git clone --depth=1 https://github.com/nescitus/Rodent_III.git
RUN make --directory Rodent_III/sources

RUN pacman -R --noconfirm git

COPY package.json ./
COPY yarn.lock ./
RUN yarn --pure-lockfile

COPY ./. .
RUN yarn build

EXPOSE 4096
CMD ["yarn", "start"]
