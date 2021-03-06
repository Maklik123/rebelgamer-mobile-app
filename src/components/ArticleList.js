// @flow

import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import React from 'react';
import { NavigationState } from 'react-navigation';

import ArticleListItem from './ArticleListItem';
import Post from '../wp-types';
import { REBELGAMER_RED } from '../constants';
import translate from '../translate';

type Props = {
  navigation: NavigationState,
  posts: typeof Post[],
  onTagSelect: Function,
  onRefresh: Function,
  onLoadMoreArticles: Function,
  isRefreshing: boolean,
  isLoadingMoreArticles: boolean,
  listHeader: any
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CED0CE',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE'
  },
  loadMoreButton: {
    margin: 10
  },
  noArticlesText: {
    textAlign: 'center',
    margin: 10
  }
});

class ArticleList extends React.Component<Props> {
  onTagSelect = tagName => {
    const { onTagSelect } = this.props;
    onTagSelect(tagName);
  };

  renderFooter = () => {
    const { isLoadingMoreArticles, posts, onLoadMoreArticles, isRefreshing } = this.props;

    if (!isLoadingMoreArticles && posts.length > 0) {
      return (
        <View>
          <View style={styles.separator} />
          <Button
            style={styles.loadMoreButton}
            title={translate('LOAD_MORE_ARTICLES')}
            color={REBELGAMER_RED}
            onPress={onLoadMoreArticles}
          />
        </View>
      );
    }

    if (isRefreshing) {
      return null;
    }

    if (posts.length === 0) {
      return <Text style={styles.noArticlesText}>{translate('FOUND_NO_ARTICLES')}</Text>;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={REBELGAMER_RED} animating size="large" />
      </View>
    );
  };

  render() {
    const { navigation, posts, listHeader, isRefreshing, onRefresh } = this.props;
    const { navigate } = navigation;
    return (
      <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableHighlight
              underlayColor="lightgray"
              onPress={() => navigate('ArticleDetails', { article: item })}
            >
              <ArticleListItem article={item} />
            </TouchableHighlight>
          )}
          keyExtractor={(item: Post) => item.id.toString()}
          ListHeaderComponent={listHeader}
          // Necessary to show footer on Android
          // eslint-disable-next-line react/jsx-no-bind
          ListFooterComponent={this.renderFooter.bind(this)}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </View>
    );
  }
}

export default ArticleList;
